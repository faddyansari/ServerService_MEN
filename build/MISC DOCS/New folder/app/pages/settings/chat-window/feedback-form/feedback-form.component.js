"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackForm = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var toast_notifications_component_1 = require("../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var confirmation_dialog_component_1 = require("../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var FeedbackForm = /** @class */ (function () {
    function FeedbackForm(_chatWindowCustomizations, _appStateService, formbuilder, snackBar, dialog) {
        var _this = this;
        this._chatWindowCustomizations = _chatWindowCustomizations;
        this._appStateService = _appStateService;
        this.formbuilder = formbuilder;
        this.snackBar = snackBar;
        this.dialog = dialog;
        this.subscriptions = [];
        this.displaySettings = undefined;
        this.enableEdit = false;
        this.loading = false;
        //Only Letters Regex
        this.pattern = /^[a-z][a-z.\s-]{1,255}$\?*/i;
        //inputFields: Array<any> = []
        //custom Fields
        this.customFields = [];
        this.saving = false;
        this.selectedIndex = -1;
        this.isDragged = false;
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Chat Window Customizations');
        this.subscriptions.push(this._chatWindowCustomizations.GetDisplaySettings().subscribe(function (displaySettings) {
            if (displaySettings) {
                _this.displaySettings = displaySettings.settings.chatwindow.feedbackForm;
                _this.themeSettings = displaySettings.settings.chatwindow.dialogSettings;
                _this.customFields = displaySettings.settings.chatwindow.feedbackForm.customFields;
                _this.enableEdit = false;
                _this.form = formbuilder.group({
                    'query1': [
                        _this.displaySettings.query1,
                        [
                            forms_1.Validators.required,
                        ]
                    ],
                    'query2': [
                        _this.displaySettings.query2,
                        [
                            forms_1.Validators.required,
                        ]
                    ]
                });
                _this.feedBackSettings = formbuilder.group({
                    'feedbackRequired': [
                        (_this.displaySettings.feedbackRequired) ? _this.displaySettings.feedbackRequired : false
                    ]
                });
                //if (this.customFields && this.customFields.length) {
                _this.CustomFormFields = _this.formbuilder.group({
                    fields: _this.formbuilder.array((_this.customFields && _this.customFields.length) ? _this.TransformFields(_this.customFields) : [])
                });
                _this.previousCustomFields = _this.formbuilder.group({
                    fields: _this.formbuilder.array((_this.customFields && _this.customFields.length) ? _this.TransformFields(_this.customFields) : [])
                });
                //}
                // if (this.customFields && this.customFields.length) {
                // 	this.CustomFormFields = this.formbuilder.group({
                // 		fields: this.formbuilder.array(this.TransformFields(this.customFields))
                // 	});
                // }
            }
        }));
    }
    FeedbackForm.prototype.ngOnInit = function () {
    };
    FeedbackForm.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    FeedbackForm.prototype.EnableEdit = function (value) {
        var _this = this;
        if (this.CustomFormFields.value.fields && this.CustomFormFields.value.fields.length && this.enableEdit) {
            this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
                panelClass: ['confirmation-dialog'],
                data: { headermsg: 'Are you sure you want to cancel edited changes? All changes will be lost.' }
            }).afterClosed().subscribe(function (data) {
                if (data == 'ok') {
                    _this.enableEdit = value;
                    _this.CustomFormFields = _this.previousCustomFields;
                    //this.inputFields = [];
                    // let fields = this.CustomFormFields.get('fields') as FormArray;
                    // if (fields && this.CustomFormFields && this.CustomFormFields.value) {
                    // 	this.CustomFormFields.value.fields.map((f, i) => {
                    // 		fields.removeAt(i)
                    // 	})
                    // }
                    // this.CustomFormFields.reset()
                    //this.customFields = this.previousCustomFields
                    if (!value) {
                        _this.form.get('query1').setValue(_this.displaySettings.query1);
                        _this.form.get('query2').setValue(_this.displaySettings.query2);
                        _this.form.updateValueAndValidity();
                    }
                }
            });
        }
        else {
            //this.inputFields = []
            //this.CustomFormFields = this.previousCustomFields
            this.enableEdit = value;
            if (!value) {
                this.form.get('query1').setValue(this.displaySettings.query1);
                this.form.get('query2').setValue(this.displaySettings.query2);
                this.form.updateValueAndValidity();
            }
        }
    };
    FeedbackForm.prototype.SubmitForm = function () {
        var _this = this;
        this.loading = true;
        this._chatWindowCustomizations.UpdateChatWindowContentSettings('feedbackForm', {
            query1: this.form.get('query1').value,
            query2: this.form.get('query2').value,
            btn1Text: this.displaySettings.btn1Text,
            btn2Text: this.displaySettings.btn2Text,
            transcriptContent: this.displaySettings.transcriptContent,
            feedbackRequired: this.feedBackSettings.get('feedbackRequired').value,
            customFields: (this.CustomFormFields.value.fields && this.CustomFormFields.value.fields.length) ? this.CustomFormFields.value.fields : []
        }).subscribe(function (response) {
            _this.loading = false;
            if (response.status == 'ok') {
                //Todo Completion Logic Here
                // let fields = this.CustomFormFields.get('fields') as FormArray;
                // if (fields && this.CustomFormFields && this.CustomFormFields.value) {
                // 	this.CustomFormFields.value.fields.map((f, i) => {
                // 		fields.removeAt(i)
                // 	})
                // }
                //this.CustomFormFields.reset()
                _this.previousCustomFields = _this.CustomFormFields;
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Fields Updated successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
        }, function (err) {
            _this.loading = false;
            _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'Unable to Update Field!'
                },
                duration: 2000,
                panelClass: ['user-alert', 'error']
            });
            //Todo Error View Logic Here
        });
        //this.inputFields = []
    };
    FeedbackForm.prototype.TransformFields = function (fields) {
        var _this = this;
        var fb = [];
        fields.map(function (field) {
            fb.push(_this.formbuilder.group({
                label: [field.label, forms_1.Validators.required],
                name: [field.name, forms_1.Validators.required],
                type: [field.type, forms_1.Validators.required],
                isCollection: [field.isCollection, forms_1.Validators.required],
                required: [field.required, forms_1.Validators.required],
                default: [field.default, forms_1.Validators.required],
                elementType: [field.elementType, forms_1.Validators.required],
                placeholder: [(field.placeholder) ? field.placeholder : ''],
                value: [(field.value) ? field.value : ''],
                options: [field.options],
                mandatory: [(field.mandatory) ? field.mandatory : false]
            }));
        });
        return fb;
    };
    FeedbackForm.prototype.TransformOptions = function (options) {
        ////console.log(options);
        var _this = this;
        var fb = [];
        options.map(function (option) {
            fb.push(_this.formbuilder.group({
                name: [option.name, [forms_1.Validators.required]],
                value: [option.value, [forms_1.Validators.required]],
            }));
        });
        return fb;
    };
    FeedbackForm.prototype.GetFields = function () {
        return this.CustomFormFields.get('fields').controls;
    };
    FeedbackForm.prototype.drag = function (event) {
        // event.preventDefault();
        // event.stopPropagation();
        // event.stopImmediatePropagation();
        // event.dataTransfer.setData("text", event.target.id);
        // //console.log('Drage Start', event);
        event.dataTransfer.setData("text", event.target.id);
        ////console.log('Drag Start', event.dataTransfer.getData("text"))
    };
    FeedbackForm.prototype.drop = function (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        ////console.log('Drop', event.dataTransfer.getData("text"));
        this.isDragged = false;
        // let el = document.getElementById(event.dataTransfer.getData("text"));
        // if (el) {
        // 	el.draggable = false;
        // }
        this.AddField(event.dataTransfer.getData("text"));
        // var data = ev.dataTransfer.getData("text");
        // ev.target.appendChild(document.getElementById(data));
    };
    FeedbackForm.prototype.AddField = function (value) {
        var fb;
        switch (value.trim()) {
            case "checkbox":
                fb = this.formbuilder.group({
                    label: ['Checkbox', [forms_1.Validators.required]],
                    name: [null, [forms_1.Validators.required]],
                    type: ['boolean'],
                    isCollection: [false],
                    required: [false, forms_1.Validators.required],
                    default: [false, forms_1.Validators.required],
                    elementType: ['checkbox', forms_1.Validators.required],
                    value: [null],
                    options: [[]],
                    mandatory: [null]
                });
                break;
            case "date":
                fb = this.formbuilder.group({
                    label: ['Datebox', [forms_1.Validators.required]],
                    name: [null, [forms_1.Validators.required]],
                    type: ['string'],
                    isCollection: [false],
                    required: [false, forms_1.Validators.required],
                    default: [false, forms_1.Validators.required],
                    elementType: ['date', forms_1.Validators.required],
                    value: [''],
                    options: [[]],
                    mandatory: [null]
                });
                break;
            case "textbox":
                fb = this.formbuilder.group({
                    label: ['Textbox', [forms_1.Validators.required]],
                    name: [null, [forms_1.Validators.required]],
                    type: ['string'],
                    isCollection: [false],
                    required: [false, forms_1.Validators.required],
                    default: [false, forms_1.Validators.required],
                    elementType: ['text', forms_1.Validators.required],
                    placeholder: [''],
                    value: [''],
                    options: [[]],
                    mandatory: [null]
                });
                break;
            case "dropdown":
                fb = this.formbuilder.group({
                    label: ['Select Option', [forms_1.Validators.required]],
                    name: [null, [forms_1.Validators.required]],
                    type: ['string'],
                    isCollection: [false],
                    required: [false, forms_1.Validators.required],
                    default: [false, forms_1.Validators.required],
                    elementType: ['dropdown', forms_1.Validators.required],
                    value: [''],
                    options: [[]],
                    mandatory: [null]
                });
                break;
            case "radio":
                fb = this.formbuilder.group({
                    label: ['Radio Button', [forms_1.Validators.required]],
                    name: [null, [forms_1.Validators.required]],
                    type: ['boolean'],
                    isCollection: [false, forms_1.Validators.required],
                    required: [false, forms_1.Validators.required],
                    default: [false, forms_1.Validators.required],
                    elementType: ['radio', forms_1.Validators.required],
                    value: [''],
                    placeholder: [''],
                    options: [[]],
                    mandatory: [null]
                });
                break;
        }
        var fields = this.CustomFormFields.get('fields');
        fields.push(fb);
        //this.inputFields.push(fb.value);
        //console.log(this.inputFields);
    };
    FeedbackForm.prototype.SetEdit = function (i) {
        var fields = this.CustomFormFields.get('fields');
        fields.controls[i].value;
        this.selectedIndex = i;
        this.selectedField = this.formbuilder.group({
            label: [fields.controls[i].value.label, [forms_1.Validators.required]],
            name: [fields.controls[i].value.name, [forms_1.Validators.required]],
            type: [fields.controls[i].value.type],
            isCollection: [fields.controls[i].value.isCollection],
            required: [fields.controls[i].value.required, forms_1.Validators.required],
            default: [false, forms_1.Validators.required],
            elementType: [fields.controls[i].value.elementType, forms_1.Validators.required],
            value: [fields.controls[i].value.value],
            placeholder: [(fields.controls[i].value.placeholder) ? fields.controls[i].value.placeholder : ''],
            options: this.formbuilder.array(this.TransformOptions(fields.controls[i].value.options)),
            mandatory: [(fields.controls[i].value.mandatory) ? fields.controls[i].value.mandatory : '']
        });
    };
    FeedbackForm.prototype.SetCheckBoxValue = function (event) {
        if (((this.selectedField.get('elementType').value == 'checkbox') || (this.selectedField.get('elementType').value == 'radio')) && (event.target.value == 'true' || event.target.value == 'false'))
            this.selectedField.get('value').setValue((event.target.value == 'true') ? true : false);
        else
            this.selectedField.get('value').setValue('');
    };
    FeedbackForm.prototype.SaveField = function () {
        var fields = this.CustomFormFields.get('fields');
        fields.at(this.selectedIndex).patchValue(this.selectedField.value);
        // console.log(this.CustomFormFields);
        // console.log(fields);
        //this.inputFields[this.selectedIndex] = this.selectedField.value;
        //fields.at(this.selectedIndex).get('options').patchValue(this.formbuilder.array(this.TransformOptions(this.selectedField.get('options').value)));
        // //console.log('selectedField Value : ', this.selectedField.value);
        this.selectedField = undefined;
        this.selectedIndex = -1;
    };
    FeedbackForm.prototype.DeleteField = function (i) {
        var fields = this.CustomFormFields.get('fields');
        //this.inputFields.splice(i, 1);
        fields.removeAt(i);
        this.selectedField = undefined;
        this.selectedIndex = -1;
        //console.log(this.inputFields);
        //console.log(this.inputFields[this.selectedIndex]);
    };
    FeedbackForm.prototype.allowDrop = function (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        this.isDragged = true;
    };
    FeedbackForm.prototype.DragLeave = function (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        this.isDragged = false;
        ////console.log('Drag End');
    };
    FeedbackForm.prototype.AddOption = function () {
        var fb = this.formbuilder.group({
            name: ['', [forms_1.Validators.required]],
            value: [(this.selectedField.get('elementType').value == 'radio') ? null : '', [forms_1.Validators.required]],
        });
        var options = this.selectedField.get('options');
        ////console.log(options);
        options.push(fb);
    };
    FeedbackForm.prototype.GetOptionsDisplay = function (field) {
        var fa = field.get('options');
        ////console.log(field);
        return fa.controls;
    };
    FeedbackForm.prototype.DeleteOption = function (i) {
        var fa = this.selectedField.get('options');
        // //console.log('index',i);
        // //console.log('option',fa);
        fa.removeAt(i);
    };
    FeedbackForm.prototype.GetOptions = function () {
        return this.selectedField.get('options').controls;
    };
    FeedbackForm.prototype.Clear = function () {
        this.selectedField = undefined;
        this.selectedIndex = -1;
    };
    FeedbackForm.prototype.OrderUp = function (index) {
        var fields = this.CustomFormFields.value.fields;
        var customFields = this.CustomFormFields.get('fields');
        if (fields.length && index >= 1) {
            var previousValue = fields[index - 1];
            customFields.at(index - 1).patchValue(fields[index]);
            customFields.at(index).patchValue(previousValue);
            fields[index - 1] = fields[index];
            fields[index] = previousValue;
        }
        else
            return;
    };
    FeedbackForm.prototype.OrderDown = function (index) {
        var fields = this.CustomFormFields.value.fields;
        var customFields = this.CustomFormFields.get('fields');
        if (fields.length && index < fields.length - 1) {
            var next = fields[index + 1];
            customFields.at(index + 1).patchValue(fields[index]);
            customFields.at(index).patchValue(next);
            fields[index + 1] = fields[index];
            fields[index] = next;
        }
        else
            return;
    };
    FeedbackForm = __decorate([
        core_1.Component({
            selector: 'app-feedback-form',
            templateUrl: './feedback-form.component.html',
            styleUrls: ['./feedback-form.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            providers: []
        })
    ], FeedbackForm);
    return FeedbackForm;
}());
exports.FeedbackForm = FeedbackForm;
//# sourceMappingURL=feedback-form.component.js.map