"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurveyListComponent = void 0;
var core_1 = require("@angular/core");
var confirmation_dialog_component_1 = require("../../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var SurveyListComponent = /** @class */ (function () {
    function SurveyListComponent(_surveyService, dialog) {
        var _this = this;
        this._surveyService = _surveyService;
        this.dialog = dialog;
        this.allSurveys = [];
        this.subscriptions = [];
        this.subscriptions.push(this._surveyService.AllSurveys.subscribe(function (data) {
            if (data && data.length) {
                _this.allSurveys = data;
            }
            else {
                _this.allSurveys = [];
            }
        }));
    }
    SurveyListComponent.prototype.ngOnInit = function () {
    };
    SurveyListComponent.prototype.editSurvey = function (survey) {
        this._surveyService.selectedSurvey.next(survey);
    };
    SurveyListComponent.prototype.deleteSurvey = function (id) {
        var _this = this;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: "Are you sure want to delete this survey?" }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this._surveyService.deleteSurvey(id);
            }
        });
    };
    SurveyListComponent.prototype.toggleActivation = function (id, flag) {
        var _this = this;
        this.allSurveys.forEach(function (val) {
            if (val.activated && val._id != id) {
                val.activated = false;
                return;
            }
            else {
                _this._surveyService.toggleActivation(id, flag).subscribe(function (res) {
                });
            }
        });
    };
    SurveyListComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    SurveyListComponent = __decorate([
        core_1.Component({
            selector: 'app-survey-list',
            templateUrl: './survey-list.component.html',
            styleUrls: ['./survey-list.component.css'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], SurveyListComponent);
    return SurveyListComponent;
}());
exports.SurveyListComponent = SurveyListComponent;
//# sourceMappingURL=survey-list.component.js.map