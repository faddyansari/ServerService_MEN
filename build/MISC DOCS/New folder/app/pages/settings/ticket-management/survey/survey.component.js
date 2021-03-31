"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurveyComponent = void 0;
var core_1 = require("@angular/core");
var SurveyComponent = /** @class */ (function () {
    function SurveyComponent(_authService, _appStateService, _surveyService) {
        var _this = this;
        this._authService = _authService;
        this._appStateService = _appStateService;
        this._surveyService = _surveyService;
        this.subscriptions = [];
        this.addSurvey = false;
        this.selectedSurvey = undefined;
        this.surveyObject = undefined;
        this.surveyObject = {
            nsp: '',
            surveyName: '',
            criteria: 'asc',
            basicQuestion: '',
            pointScaleBasic: '3',
            RatingLabelBasic: [{
                    name: 'Extremely satisfied',
                    ForRadio: ['2', '3', '5', '7'],
                    color: "#3c763d"
                },
                {
                    name: 'Mostly satisfied',
                    ForRadio: ['5', '7'],
                    color: "#368763"
                },
                {
                    name: 'Slightly satisfied',
                    ForRadio: ['7'],
                    color: "#52ba5b"
                },
                {
                    name: 'Neither satisfied nor dissatisfied',
                    ForRadio: ['3', '5', '7'],
                    color: "#f7b555"
                },
                {
                    name: 'Slightly dissatisfied',
                    ForRadio: ['7'],
                    color: "#ff681f"
                },
                {
                    name: 'Mostly dissatisfied',
                    ForRadio: ['5', '7'],
                    color: "#e55353"
                },
                {
                    name: 'Extremely dissatisfied',
                    ForRadio: ['2', '3', '5', '7'],
                    color: "#d64646"
                }],
            AdditionalQuestions: [{ question: '' }],
            pointScaleAdd: '3',
            RatingLabelAdd: [{
                    name: 'Extremely satisfied',
                    ForRadio: ['2', '3', '5', '7'],
                    color: "#3c763d"
                },
                {
                    name: 'Mostly satisfied',
                    ForRadio: ['5', '7'],
                    color: "#368763"
                },
                {
                    name: 'Slightly satisfied',
                    ForRadio: ['7'],
                    color: "#52ba5b"
                },
                {
                    name: 'Neither satisfied nor dissatisfied',
                    ForRadio: ['3', '5', '7'],
                    color: "#f7b555"
                },
                {
                    name: 'Slightly dissatisfied',
                    ForRadio: ['7'],
                    color: "#ff681f"
                },
                {
                    name: 'Mostly dissatisfied',
                    ForRadio: ['5', '7'],
                    color: "#e55353"
                },
                {
                    name: 'Extremely dissatisfied',
                    ForRadio: ['2', '3', '5', '7'],
                    color: "#d64646"
                }],
            activated: false,
            thankyouMessage: '',
            commentBox: false,
            additionalDetails: '',
            sendWhen: 'resolved',
            created: { date: new Date().toISOString(), by: '' },
            lastModified: { date: '', by: '' },
        };
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Ticket Management');
        this.subscriptions.push(_authService.getPackageInfo().subscribe(function (pkg) {
            if (pkg) {
                _this.package = pkg.tickets.satisfactionSurvey;
                if (!_this.package.allowed) {
                    _this._appStateService.NavigateTo('/noaccess');
                }
            }
            // console.log(agent);
        }));
        this.subscriptions.push(this._surveyService.AddSurvey.subscribe(function (data) {
            _this.addSurvey = data;
        }));
        this.subscriptions.push(this._surveyService.selectedSurvey.subscribe(function (data) {
            _this.selectedSurvey = data;
        }));
    }
    SurveyComponent.prototype.ngOnInit = function () {
    };
    SurveyComponent.prototype.AddSurvey = function () {
        this._surveyService.AddSurvey.next(true);
    };
    SurveyComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    SurveyComponent = __decorate([
        core_1.Component({
            selector: 'app-survey',
            templateUrl: './survey.component.html',
            styleUrls: ['./survey.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], SurveyComponent);
    return SurveyComponent;
}());
exports.SurveyComponent = SurveyComponent;
//# sourceMappingURL=survey.component.js.map