"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookRulesComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var FacebookRulesComponent = /** @class */ (function () {
    function FacebookRulesComponent(formbuilder, _ticketAutomationService, _integrationsService) {
        var _this = this;
        this.formbuilder = formbuilder;
        this._ticketAutomationService = _ticketAutomationService;
        this._integrationsService = _integrationsService;
        this.editCase = new core_1.EventEmitter();
        this.subscriptions = [];
        this.all_groups = [];
        this.subscriptions.push(this._integrationsService.getFbRule().subscribe(function (data) {
            if (data) {
                _this.ruleForm.setValue(data);
            }
        }));
        this.subscriptions.push(this._ticketAutomationService.Groups.subscribe(function (groups) {
            _this.all_groups = groups;
        }));
    }
    FacebookRulesComponent.prototype.ngOnInit = function () {
        this.ruleForm = this.formbuilder.group({
            'postToTicketsAllow': [true, []],
            'visitorsToTickets': [false, []],
            'pagesToTickets': [true, []],
            'ticketChoice': ['newTicket', []],
            'SpecificKeywords': [true, []],
            'keywords': [['support', 'sbt', 'beelinks'], []],
            'assignToGroup': ['', forms_1.Validators.required]
        });
    };
    FacebookRulesComponent.prototype.UpdateRule = function () {
        var _this = this;
        console.log(this.ruleForm.value);
        var obj = this.ParseObj(this.ruleForm.value);
        console.log(obj);
        this._integrationsService.setRuleset(obj).subscribe(function (response) {
            _this.editCase.emit(false);
        });
    };
    FacebookRulesComponent.prototype.ChangeTicketChoice = function (event) {
        if (event.target.value == 'singleTicket') {
            this.status.nativeElement.checked = true;
            this.status.nativeElement.disabled = true;
        }
        else {
            this.status.nativeElement.checked = false;
            this.status.nativeElement.disabled = false;
        }
    };
    FacebookRulesComponent.prototype.ParseObj = function (values) {
        // if (!values.postToTicketsAllow) {
        // 	values.postToTicketsAllow = false,
        // 		values.visitorsToTicket = false,
        // 		values.pagesToTickets = false,
        // 		values.ticketChoice = '',
        // 		values.SpecificKeywords = false,
        // 		values.keywords = [],
        // 		values.assignToGroup = ''
        // }
        // else {
        if (values.ticketChoice == "singleTicket") {
            values.visitorsToTickets = true;
            values.SpecificKeywords = false;
            values.keywords = [];
        }
        // }
        return values;
    };
    FacebookRulesComponent.prototype.CancelRule = function () {
        this.editCase.emit(false);
    };
    __decorate([
        core_1.ViewChild('status')
    ], FacebookRulesComponent.prototype, "status", void 0);
    __decorate([
        core_1.Output('editCase')
    ], FacebookRulesComponent.prototype, "editCase", void 0);
    FacebookRulesComponent = __decorate([
        core_1.Component({
            selector: 'app-facebook-rules',
            templateUrl: './facebook-rules.component.html',
            styleUrls: ['./facebook-rules.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], FacebookRulesComponent);
    return FacebookRulesComponent;
}());
exports.FacebookRulesComponent = FacebookRulesComponent;
//# sourceMappingURL=facebook-rules.component.js.map