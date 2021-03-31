"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketTemplatesComponent = void 0;
var core_1 = require("@angular/core");
var TicketTemplatesComponent = /** @class */ (function () {
    function TicketTemplatesComponent(_authService, _appStateService, _ticketTemplateService) {
        var _this = this;
        this._authService = _authService;
        this._appStateService = _appStateService;
        this._ticketTemplateService = _ticketTemplateService;
        this.subscriptions = [];
        this.addTemplate = false;
        this.selectedTemplate = undefined;
        this.ticketTemplateObject = undefined;
        this.nsp = '';
        this.email = '';
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Ticket Management');
        this.nsp = this._ticketTemplateService.Agent.nsp;
        this.email = this._ticketTemplateService.Agent.email;
        this.ticketTemplateObject = {
            nsp: '',
            templateName: '',
            templateDesc: '',
            availableFor: 'allagents',
            groupName: [],
            subject: '',
            status: '',
            priority: '',
            group: '',
            agent: {},
            cannedForm: '',
            tags: [],
            watchers: [],
            message: '',
            created: { date: new Date().toISOString(), by: this.email },
            lastModified: { date: '', by: '' }
        };
        this.subscriptions.push(_authService.getPackageInfo().subscribe(function (pkg) {
            if (pkg) {
                _this.package = pkg.tickets.ticketTemplate;
                if (!_this.package.allowed) {
                    _this._appStateService.NavigateTo('/noaccess');
                }
            }
        }));
        this.subscriptions.push(this._ticketTemplateService.AddTemplate.subscribe(function (data) {
            _this.addTemplate = data;
        }));
        this.subscriptions.push(this._ticketTemplateService.selectedTemplate.subscribe(function (data) {
            _this.selectedTemplate = data;
        }));
    }
    TicketTemplatesComponent.prototype.ngOnInit = function () {
    };
    // save() {
    // 	this.formArray.push(this.newTemplateForm.value)
    // 	console.log(this.formArray);
    // 	this.newTemplateForm.reset()
    // 	this.newTemplateForm.get('availFor').setValue("groupagent")
    // }
    TicketTemplatesComponent.prototype.AddTemplate = function () {
        this._ticketTemplateService.AddTemplate.next(true);
    };
    TicketTemplatesComponent = __decorate([
        core_1.Component({
            selector: 'app-templates',
            templateUrl: './ticket-templates.component.html',
            styleUrls: ['./ticket-templates.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], TicketTemplatesComponent);
    return TicketTemplatesComponent;
}());
exports.TicketTemplatesComponent = TicketTemplatesComponent;
//# sourceMappingURL=ticket-templates.component.js.map