"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSurveyComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var confirmation_dialog_component_1 = require("../../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var toast_notifications_component_1 = require("../../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var AddSurveyComponent = /** @class */ (function () {
    function AddSurveyComponent(formbuilder, _surveyService, dialog, snackBar) {
        var _this = this;
        this.formbuilder = formbuilder;
        this._surveyService = _surveyService;
        this.dialog = dialog;
        this.snackBar = snackBar;
        this.SpecialChar = /^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/;
        this.whiteSpace = /^[^-\s][a-zA-Z0-9_\s-]+$/;
        this.subscriptions = [];
        this.selectedSurvey = undefined;
        this.editCase = false;
        this.addTrue = false;
        this.changebasic = false;
        this.changeadd = false;
        this.nsp = '';
        this.email = '';
        this.RadioOptionsBasic = [];
        this.RadioOptionsAdd = [];
        this.allSurveys = [];
        this.defaultValues = [];
        this.nsp = this._surveyService.Agent.nsp;
        this.email = this._surveyService.Agent.email;
        this.subscriptions.push(this._surveyService.selectedSurvey.subscribe(function (data) {
            if (data) {
                _this.selectedSurvey = data;
                _this.subscriptions.push(_this._surveyService.DefaultJSON.subscribe(function (response) {
                    if (response) {
                        _this.defaultValues = response;
                    }
                }));
                _this.subscriptions.push(_this._surveyService.CheckIfSurveyIsInTicket(_this.selectedSurvey._id).subscribe(function (res) {
                    if (res && res.exists) {
                        _this.editCase = true;
                        _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                            data: {
                                img: 'warning',
                                msg: 'Since this survey is already been sent in ticket,so point scale and no. of questions cannot be altered. However, you can rephrase the questions and answer choices.'
                            },
                            duration: 10000,
                            panelClass: ['user-alert', 'warning']
                        });
                    }
                    else {
                        _this.editCase = false;
                    }
                }));
                if (_this.selectedSurvey.AdditionalQuestions.length) {
                    _this.addTrue = true;
                }
                else {
                    _this.addTrue = false;
                }
            }
            else {
                _this.selectedSurvey = undefined;
            }
        }));
        this.subscriptions.push(this._surveyService.AllSurveys.subscribe(function (data) {
            if (data && data.length) {
                _this.allSurveys = data;
            }
            else {
                _this.allSurveys = [];
            }
        }));
    }
    AddSurveyComponent.prototype.ngOnInit = function () {
        this.surveyForm = this.formbuilder.group({
            'surveyName': [this.SurveyObject.surveyName,
                [
                    forms_1.Validators.required,
                    forms_1.Validators.minLength(2)
                ]
            ],
            'criteria': [this.SurveyObject.criteria],
            'basicQuestion': [this.SurveyObject.basicQuestion, [forms_1.Validators.required, forms_1.Validators.minLength(2)]],
            'pointScaleBasic': [this.SurveyObject.pointScaleBasic, []],
            'AdditionalQuestions': this.formbuilder.array(this.TransformQuestions(this.SurveyObject.AdditionalQuestions)),
            'pointScaleAdd': [this.SurveyObject.pointScaleAdd, []],
            'commentBox': [this.SurveyObject.commentBox, []],
            'thankyouMessage': [this.SurveyObject.thankyouMessage, []
            ],
            'additionalDetails': [this.SurveyObject.additionalDetails, []
            ],
            'sendWhen': [this.SurveyObject.sendWhen, []],
            'activated': [this.SurveyObject.activated, []]
        });
        this.RadioOptionsBasic = JSON.parse(JSON.stringify(this.SurveyObject.RatingLabelBasic));
        this.RadioOptionsAdd = JSON.parse(JSON.stringify(this.SurveyObject.RatingLabelAdd));
        this.onValueChanges();
    };
    AddSurveyComponent.prototype.onValueChanges = function () {
        var _this = this;
        this.surveyForm.valueChanges.subscribe(function (val) {
            _this.formChanges = val;
        });
    };
    AddSurveyComponent.prototype.GetRadioDataBasic = function (value) {
        if (this.selectedSurvey && this.changebasic) {
            return this.defaultValues.filter(function (r) { return r.ForRadio.includes(value); });
        }
        else {
            return this.RadioOptionsBasic.filter(function (r) { return r.ForRadio.includes(value); });
        }
    };
    AddSurveyComponent.prototype.changeBasic = function (ev) {
        if (ev.target.value)
            this.changebasic = true;
        else
            this.changebasic = false;
    };
    AddSurveyComponent.prototype.changeAdd = function (ev) {
        if (ev.target.value)
            this.changeadd = true;
        else
            this.changeadd = false;
    };
    AddSurveyComponent.prototype.GetRadioDataAdd = function (value) {
        if (this.selectedSurvey && this.changeadd) {
            return this.defaultValues.filter(function (r) { return r.ForRadio.includes(value); });
        }
        else {
            return this.RadioOptionsAdd.filter(function (r) { return r.ForRadio.includes(value); });
        }
    };
    AddSurveyComponent.prototype.GetControls = function (name) {
        return this.surveyForm.get(name).controls;
    };
    AddSurveyComponent.prototype.removeAdditionalQuestion = function () {
        while (this.surveyForm.get('AdditionalQuestions').length !== 0) {
            this.surveyForm.get('AdditionalQuestions').removeAt(0);
        }
        this.addTrue = false;
    };
    AddSurveyComponent.prototype.TransformQuestions = function (questions) {
        var _this = this;
        var fb = [];
        questions.map(function (ques) {
            fb.push(_this.formbuilder.group({
                question: [ques.question]
            }));
        });
        return fb;
    };
    AddSurveyComponent.prototype.addAdditionalQuestion = function () {
        this.addTrue = true;
    };
    AddSurveyComponent.prototype.addQuestion = function () {
        var val = this.formbuilder.group({
            question: ['', []]
        });
        var form = this.surveyForm.get('AdditionalQuestions');
        form.push(val);
    };
    AddSurveyComponent.prototype.deleteQuestion = function (index) {
        var questions = this.surveyForm.get('AdditionalQuestions');
        questions.removeAt(index);
        if (questions.length == 0) {
            this.addTrue = false;
        }
    };
    AddSurveyComponent.prototype.moveUp = function (index) {
        if (index >= 1) {
            this.swap(this.surveyForm.controls.AdditionalQuestions.controls, index, index - 1);
        }
        else {
            this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'No question above, Not allowed!'
                },
                duration: 2000,
                panelClass: ['user-alert', 'warning']
            });
        }
    };
    AddSurveyComponent.prototype.moveDown = function (index) {
        if (index < this.surveyForm.get('AdditionalQuestions').length - 1) {
            this.swap(this.surveyForm.controls.AdditionalQuestions.controls, index, index + 1);
        }
        else {
            this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'No question below, Not allowed!'
                },
                duration: 2000,
                panelClass: ['user-alert', 'warning']
            });
        }
    };
    AddSurveyComponent.prototype.swap = function (array, index1, index2) {
        var temp = array[index1];
        array[index1] = array[index2];
        array[index2] = temp;
    };
    AddSurveyComponent.prototype.ChangeRatings = function () {
        this.RadioOptionsBasic.reverse();
        this.RadioOptionsAdd.reverse();
    };
    AddSurveyComponent.prototype.AddSurvey = function () {
        var _this = this;
        if (this.allSurveys && this.allSurveys.filter(function (data) { return data.surveyName.toLowerCase().trim() == _this.surveyForm.get('surveyName').value.toLowerCase().trim(); }).length > 0) {
            this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'Survey name already exists!'
                },
                duration: 3000,
                panelClass: ['user-alert', 'warning']
            });
            return;
        }
        else {
            var survey = {
                surveyName: this.surveyForm.get('surveyName').value,
                nsp: this.nsp,
                criteria: this.surveyForm.get('criteria').value,
                basicQuestion: this.surveyForm.get('basicQuestion').value,
                pointScaleBasic: this.surveyForm.get('pointScaleBasic').value,
                RatingLabelBasic: this.RadioOptionsBasic.filter(function (r) { return r.ForRadio.includes(_this.surveyForm.get('pointScaleBasic').value); }),
                AdditionalQuestions: this.ParseQuestions(this.surveyForm.get('AdditionalQuestions')),
                pointScaleAdd: this.surveyForm.get('pointScaleAdd').value,
                RatingLabelAdd: this.RadioOptionsAdd.filter(function (r) { return r.ForRadio.includes(_this.surveyForm.get('pointScaleAdd').value); }),
                thankyouMessage: this.surveyForm.get('thankyouMessage').value,
                commentBox: this.surveyForm.get('commentBox').value,
                additionalDetails: this.surveyForm.get('additionalDetails').value,
                sendWhen: this.surveyForm.get('sendWhen').value,
                activated: false,
                created: { date: new Date().toISOString(), by: this.email },
            };
            // console.log(survey);
            this._surveyService.addSurvey(survey).subscribe(function (res) {
                if (res.status == "ok") {
                }
            });
        }
    };
    AddSurveyComponent.prototype.ParseQuestions = function (questions) {
        var ques = [];
        // console.log(questions);
        questions.controls.map(function (control) {
            if (control.get('question').value != '') {
                var obj = {
                    question: control.get('question').value
                };
                ques.push(obj);
            }
            else {
                ques = [];
            }
        });
        return ques;
    };
    AddSurveyComponent.prototype.DetectChangeBasic = function (event) {
        if (event.target.value) {
            this.showOptions = this.GetRadioDataBasic(event.target.value);
            this.getOptions();
        }
    };
    AddSurveyComponent.prototype.getOptions = function (index) {
        // console.log(index);
        return this.showOptions[index].name;
    };
    AddSurveyComponent.prototype.UpdateSurvey = function () {
        // console.log(this.SurveyObject.activated);
        var _this = this;
        var Updatedsurvey = {
            surveyName: this.surveyForm.get('surveyName').value,
            nsp: this.nsp,
            criteria: this.surveyForm.get('criteria').value,
            basicQuestion: this.surveyForm.get('basicQuestion').value,
            pointScaleBasic: this.surveyForm.get('pointScaleBasic').value,
            RatingLabelBasic: this.RadioOptionsBasic.filter(function (r) { return r.ForRadio.includes(_this.surveyForm.get('pointScaleBasic').value); }),
            AdditionalQuestions: this.ParseQuestions(this.surveyForm.get('AdditionalQuestions')),
            pointScaleAdd: this.surveyForm.get('pointScaleAdd').value,
            RatingLabelAdd: this.RadioOptionsAdd.filter(function (r) { return r.ForRadio.includes(_this.surveyForm.get('pointScaleAdd').value); }),
            thankyouMessage: this.surveyForm.get('thankyouMessage').value,
            commentBox: this.surveyForm.get('commentBox').value,
            additionalDetails: this.surveyForm.get('additionalDetails').value,
            sendWhen: this.surveyForm.get('sendWhen').value,
            activated: this.SurveyObject.activated,
            created: this.SurveyObject.created,
        };
        // console.log(Updatedsurvey);
        this.subscriptions.push(this._surveyService.updateSurvey(this.selectedSurvey._id, Updatedsurvey).subscribe(function (response) {
            if (response.status == 'ok') {
            }
        }));
    };
    AddSurveyComponent.prototype.CancelSurvey = function () {
        var _this = this;
        if (this.formChanges) {
            this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
                panelClass: ['confirmation-dialog'],
                data: { headermsg: 'Are you sure want to leave?' }
            }).afterClosed().subscribe(function (data) {
                if (data == 'ok') {
                    _this._surveyService.AddSurvey.next(false);
                    _this._surveyService.selectedSurvey.next(undefined);
                }
                else {
                    return;
                }
            });
        }
        else {
            this._surveyService.AddSurvey.next(false);
            this._surveyService.selectedSurvey.next(undefined);
        }
    };
    AddSurveyComponent.prototype.ngOnDestroy = function () {
        this._surveyService.AddSurvey.next(false);
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    __decorate([
        core_1.Input()
    ], AddSurveyComponent.prototype, "SurveyObject", void 0);
    AddSurveyComponent = __decorate([
        core_1.Component({
            selector: 'app-add-survey',
            templateUrl: './add-survey.component.html',
            styleUrls: ['./add-survey.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AddSurveyComponent);
    return AddSurveyComponent;
}());
exports.AddSurveyComponent = AddSurveyComponent;
//# sourceMappingURL=add-survey.component.js.map