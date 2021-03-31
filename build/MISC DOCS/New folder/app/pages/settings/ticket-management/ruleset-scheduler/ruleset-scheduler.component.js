"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RulesetSchedulerComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var RulesetsService_1 = require("../../../../../services/LocalServices/RulesetsService");
var RulesetSchedulerComponent = /** @class */ (function () {
    function RulesetSchedulerComponent(_appStateService, formbuilder, _ruleSetService) {
        var _this = this;
        this._appStateService = _appStateService;
        this.formbuilder = formbuilder;
        this._ruleSetService = _ruleSetService;
        this.changes = false;
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Ticket Management');
        this._ruleSetService.GetRuleSetScheduler().subscribe(function (response) {
            if (response) {
                _this.formData = response;
                _this.schedulerForm = _this.formbuilder.group({
                    enabled: [response.enabled, forms_1.Validators.required],
                    type: [response.type, forms_1.Validators.required],
                    days: [response.days],
                    time: [response.time, forms_1.Validators.required],
                    scheduled_at: [new Date(response.scheduled_at)]
                });
            }
        });
        this.schedulerForm = this.formbuilder.group({
            enabled: [false, forms_1.Validators.required],
            type: ['everyday', forms_1.Validators.required],
            days: [1],
            time: ['00:00', forms_1.Validators.required],
            scheduled_at: ['']
        });
    }
    RulesetSchedulerComponent.prototype.valueChanges = function () {
        // console.log('form changes');
        this.changes = true;
        var obj = this.schedulerForm.value;
        var curr_datetime = new Date();
        switch (obj.type) {
            case 'everyday':
                var tocheck_datetime = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), obj.time.split(':')[0], obj.time.split(':')[1]);
                // console.log(curr_datetime);
                // console.log(tocheck_datetime);
                if (curr_datetime <= tocheck_datetime) {
                    // console.log('Ruleset Execution!');
                    this.schedulerForm.get('scheduled_at').setValue(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), obj.time.split(':')[0], obj.time.split(':')[1]));
                }
                else {
                    this.schedulerForm.get('scheduled_at').setValue(new Date(new Date().getFullYear(), new Date().getMonth(), (new Date().getDate()) + 1, obj.time.split(':')[0], obj.time.split(':')[1]));
                }
                break;
            case 'after':
                var after_date = this.AddDays(new Date(), obj.days);
                this.schedulerForm.get('scheduled_at').setValue(new Date(after_date.getFullYear(), after_date.getMonth(), after_date.getDate(), obj.time.split(':')[0], obj.time.split(':')[1]));
                break;
        }
    };
    RulesetSchedulerComponent.prototype.reset = function () {
        if (this.formData) {
            this.schedulerForm = this.formbuilder.group({
                enabled: [this.formData.enabled, forms_1.Validators.required],
                type: [this.formData.type, forms_1.Validators.required],
                days: [this.formData.days],
                time: [this.formData.time, forms_1.Validators.required],
                scheduled_at: [new Date(this.formData.scheduled_at)]
            });
        }
        else {
            this.schedulerForm = this.formbuilder.group({
                enabled: [false, forms_1.Validators.required],
                type: ['everyday', forms_1.Validators.required],
                days: [1],
                time: ['00:00', forms_1.Validators.required],
                scheduled_at: ['']
            });
        }
        this.changes = false;
    };
    RulesetSchedulerComponent.prototype.AddDays = function (date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };
    RulesetSchedulerComponent.prototype.ngOnInit = function () {
    };
    RulesetSchedulerComponent.prototype.save = function () {
        var _this = this;
        console.log(this.schedulerForm.value);
        this._ruleSetService.SetRuleSetScheduler(this.schedulerForm.value).subscribe(function (response) {
            if (response.status == 'ok') {
                alert('Settings saved!');
                _this.changes = false;
            }
            else {
                alert('Error!');
            }
        });
    };
    RulesetSchedulerComponent = __decorate([
        core_1.Component({
            selector: 'app-ruleset-scheduler',
            templateUrl: './ruleset-scheduler.component.html',
            styleUrls: ['./ruleset-scheduler.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            providers: [
                RulesetsService_1.RulesetSettingsService
            ]
        })
    ], RulesetSchedulerComponent);
    return RulesetSchedulerComponent;
}());
exports.RulesetSchedulerComponent = RulesetSchedulerComponent;
//# sourceMappingURL=ruleset-scheduler.component.js.map