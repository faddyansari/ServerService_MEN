"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormAddnewComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var confirmation_dialog_component_1 = require("../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var toast_notifications_component_1 = require("../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var preview_form_component_1 = require("../../../../dialogs/preview-form/preview-form.component");
var FormAddnewComponent = /** @class */ (function () {
    function FormAddnewComponent(_authService, _appStateService, formbuilder, formDesignerService, dialog, fb, snackBar) {
        var _this = this;
        this._authService = _authService;
        this._appStateService = _appStateService;
        this.formbuilder = formbuilder;
        this.formDesignerService = formDesignerService;
        this.dialog = dialog;
        this.fb = fb;
        this.snackBar = snackBar;
        //for checkbox and input field formGroupName
        this.i = 0;
        //Flags
        this.input = false;
        this.dropdown = false;
        this.radio = false;
        this.checkbox = false;
        this.isDragged = false;
        this.editCase = false;
        this.enableEdit = false;
        this.AllForms = [];
        this.inputFields = [];
        this.nsp = '';
        this.email = '';
        this.subscriptions = [];
        this.Fields = [];
        this.SelectedForm = undefined;
        //Regex
        this.urlRegex = /((http(s)?:\/\/)?([\w-]+\.)+[\w-]+[.com]+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?)/gmi;
        this.SpecialChar = /^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/;
        this.whiteSpace = /^[^-\s][a-zA-Z0-9_\s-]+$/;
        //Action Forms
        this.formActions = [];
        this.subscriptions.push(_authService.getPackageInfo().subscribe(function (pkg) {
            if (pkg) {
                _this.package = pkg.tickets.formDesigner;
                if (!_this.package.allowed) {
                    _this._appStateService.NavigateTo('/noaccess');
                }
            }
        }));
        //All forms
        this.subscriptions.push(this.formDesignerService.WholeForm.subscribe(function (response) {
            if (response && response.length)
                _this.AllForms = response;
        }));
        //For edit case
        this.subscriptions.push(this.formDesignerService.selectedForm.subscribe(function (value) {
            if (value) {
                _this.editCase = true;
                _this.SelectedForm = value;
                _this.inputFields = _this.SelectedForm.formFields;
            }
        }));
        // this.subscriptions.push(this.formDesignerService.Actions.subscribe(actions => {
        //   this.formActions = actions;
        // }));
        this.nsp = this.formDesignerService.Agent.nsp;
        this.email = this.formDesignerService.Agent.email;
    }
    FormAddnewComponent.prototype.ngOnInit = function () {
        this.createForm = this.formbuilder.group({
            'formName': [this.FormObject.formName,
                [forms_1.Validators.maxLength(50),
                    forms_1.Validators.pattern(this.SpecialChar),
                    forms_1.Validators.pattern(this.whiteSpace),
                    forms_1.Validators.minLength(2),
                    forms_1.Validators.required],
            ],
            'formHeader': [this.FormObject.formHeader,
                [forms_1.Validators.maxLength(50),
                    forms_1.Validators.minLength(2),
                    forms_1.Validators.required
                ]
            ],
            'formFooter': [this.FormObject.formFooter,
                [forms_1.Validators.maxLength(50),
                    forms_1.Validators.minLength(2),
                    forms_1.Validators.required
                ]
            ],
            'actionType': [this.FormObject.actionType,
                []
            ],
            'actionUrl': [this.FormObject.actionUrl,
                [
                    forms_1.Validators.pattern(this.urlRegex)
                ]
            ],
            'formHtml': [this.FormObject.formHTML,
                []
            ],
            'conditions': this.formbuilder.array(this.TransformConditions(this.FormObject.formFields), forms_1.Validators.required)
        });
        this.onChanges();
    };
    //NEW MAIN FUNCTIONS
    FormAddnewComponent.prototype.drag = function (event) {
        if (event.target.id) {
            event.dataTransfer.setData("text", event.target.id);
        }
        else if (!event.target.id && event.target.tagName.toLowerCase() == 'img') {
            event.dataTransfer.setData("text", event.target.parentNode.id);
        }
        else if (!event.target.id && event.target.tagName.toLowerCase() == 'b') {
            event.dataTransfer.setData("text", event.target.parentNode.id);
        }
    };
    FormAddnewComponent.prototype.allowDrop = function (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        this.isDragged = true;
    };
    FormAddnewComponent.prototype.DragLeave = function (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        this.isDragged = false;
    };
    FormAddnewComponent.prototype.drop = function (event) {
        event.preventDefault();
        this.isDragged = false;
        var id = event.dataTransfer.getData("text");
        var el = document.getElementById(id);
        var node = el.cloneNode(true);
        this.Ondrop(node);
    };
    FormAddnewComponent.prototype.Ondrop = function (readElement) {
        if (!(this.inputFields.filter(function (check) { return check.id && check.id == readElement.id; }).length > 0)) {
            readElement.id = 'input-' + Math.random() + '_' + readElement.id;
            var input = {
                id: readElement.id,
                type: readElement.id.split('_')[1]
            };
            this.inputFields.push(input);
        }
    };
    FormAddnewComponent.prototype.DeleteField = function (_id) {
        var _this = this;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: "Are you sure want to delete this field?" }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                console.log(_id);
                var ind = _this.inputFields.findIndex(function (a) { return a.id == _id; });
                _this.inputFields.splice(ind, 1);
                _this.enableEdit = false;
            }
        });
    };
    FormAddnewComponent.prototype.EditAreaForm = function (event, element) {
        event.preventDefault();
        event.stopPropagation();
        this.currentElement = document.getElementById(element.id);
        this.enableEdit = true;
        var id = element.id;
        var type = id.split('_')[1];
        switch (type) {
            case 'input':
                this.input = true;
                this.checkbox = false;
                this.dropdown = false;
                this.radio = false;
                break;
            case 'dropdown':
                this.dropdown = true;
                this.radio = false;
                this.input = false;
                this.checkbox = false;
                break;
            case 'radio':
                this.radio = true;
                this.dropdown = false;
                this.input = false;
                this.checkbox = false;
                break;
            case 'checkbox':
                this.checkbox = true;
                this.input = false;
                this.dropdown = false;
                this.radio = false;
                break;
        }
        this.CheckInList(element);
    };
    FormAddnewComponent.prototype.onChanges = function () {
        var _this = this;
        this.createForm.valueChanges.subscribe(function (val) {
            _this.formChanges = val;
        });
        this.createForm.get('conditions').valueChanges.subscribe(function (val) {
            _this.MapToDOM(_this.currentElement, val[0].label);
        });
    };
    FormAddnewComponent.prototype.MapToDOM = function (el, value) {
        if (el) {
            el.children[0].firstElementChild.innerHTML = value;
        }
    };
    FormAddnewComponent.prototype.SaveEditAreaForm = function () {
        // if (this.Fields.some(el => el.id == (this.currentElement.id))) {
        //   console.log("element exists");
        //   let index = this.Fields.findIndex(ind => ind.id == this.currentElement.id);
        //   this.Fields[index] = this.ParseFormInput(this.createForm.get('conditions') as FormArray);
        // }
        // else {
        //   console.log("new element");
        //   this.Fields = this.Fields.concat(this.ParseFormInput(this.createForm.get('conditions') as FormArray));
        // }
        this.MaptoList(this.currentElement);
        this.enableEdit = false;
        // console.log(this.Fields);
    };
    FormAddnewComponent.prototype.EditCaseSave = function () {
        this.MaptoList(this.currentElement);
        this.enableEdit = false;
    };
    FormAddnewComponent.prototype.CheckInList = function (element) {
        var _this = this;
        this.inputFields.some(function (input) {
            if (input['id'] == element.id) {
                if (input["placeholder"])
                    _this.createForm.controls['conditions'].controls[0].controls['placeholder'].setValue(input["placeholder"] ? input["placeholder"] : '');
                if (input["value"])
                    _this.createForm.controls['conditions'].controls[0].controls['value'].setValue((input["value"]) ? input["value"] : '');
                if (input["fieldName"])
                    _this.createForm.controls['conditions'].controls[0].controls['fieldName'].setValue((input["fieldName"]) ? input["fieldName"] : '');
                if (input["type"])
                    _this.createForm.controls['conditions'].controls[0].controls['type'].setValue((input["type"]) ? input["type"] : '');
                if (input["label"])
                    _this.createForm.controls['conditions'].controls[0].controls['label'].setValue((input["label"]) ? input["label"] : '');
                _this.createForm.controls['conditions'].controls[0].controls['validation'].setValue((input["validation"]) ? input["validation"] : false);
                if (input["options"]) {
                    _this.createForm.controls['conditions'].controls[0].controls['options'] = _this.formbuilder.array([]);
                    var control_1 = _this.createForm.controls['conditions'].controls[0].controls['options'];
                    input["options"].forEach(function (x) {
                        control_1.push(_this.patchValues(x.key, x.value));
                    });
                }
                return true;
            }
            else {
                _this.createForm.controls['conditions'].controls[0].controls['placeholder'].setValue('');
                _this.createForm.controls['conditions'].controls[0].controls['value'].setValue('');
                _this.createForm.controls['conditions'].controls[0].controls['fieldName'].setValue('');
                _this.createForm.controls['conditions'].controls[0].controls['type'].setValue('');
                _this.createForm.controls['conditions'].controls[0].controls['label'].setValue('');
                _this.createForm.controls['conditions'].controls[0].controls['validation'].setValue(false);
                _this.createForm.controls['conditions'].controls[0].controls['options'] = _this.formbuilder.array([]);
                return false;
            }
        });
    };
    FormAddnewComponent.prototype.MaptoList = function (el) {
        var _this = this;
        this.inputFields.map(function (input) {
            if (input['id'] == el.id) {
                if (!_this.createForm.controls['conditions'].controls[0].controls['type'].value) {
                    input['type'] = input['id'].split('_')[1];
                }
                else {
                    input["type"] = _this.createForm.controls['conditions'].controls[0].controls['type'].value;
                }
                input["placeholder"] = _this.createForm.controls['conditions'].controls[0].controls['placeholder'].value;
                input["fieldName"] = _this.createForm.controls['conditions'].controls[0].controls['fieldName'].value;
                input["label"] = _this.createForm.controls['conditions'].controls[0].controls['label'].value;
                input["validation"] = _this.createForm.controls['conditions'].controls[0].controls['validation'].value;
                input["value"] = _this.createForm.controls['conditions'].controls[0].controls['value'].value;
                input["options"] = _this.createForm.controls['conditions'].controls[0].controls['options'].value;
            }
            //map ends
        });
    };
    FormAddnewComponent.prototype.CancelEditAreaForm = function () {
        this.enableEdit = false;
    };
    FormAddnewComponent.prototype.SaveForm = function () {
        // let actionurl;
        // this.formActions.map(action => {
        //   if (action.actionType == this.createForm.get('actionType').value) {
        //     actionurl = action.actionUrl;
        //   }
        // })
        var _this = this;
        // console.log(this.inputFields);
        if (this.AllForms && this.AllForms.filter(function (data) { return data.formName.toLowerCase().trim() == _this.createForm.get('formName').value.toLowerCase().trim(); }).length > 0) {
            this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'Form Name already exists!'
                },
                duration: 3000,
                panelClass: ['user-alert', 'warning']
            });
            return;
        }
        else {
            var form = {
                nsp: this.nsp,
                type: "cannedForm",
                formName: this.createForm.get('formName').value,
                formHeader: this.createForm.get('formHeader').value,
                formFooter: this.createForm.get('formFooter').value,
                actionType: this.createForm.get('actionType').value,
                actionUrl: this.createForm.get('actionUrl').value ? this.createForm.get('actionUrl').value : '',
                // actionUrl: this.createForm.get('actionType').value == "CustomUrl" ? this.createForm.get('actionUrl').value : actionurl,
                formFields: this.inputFields,
                formHtml: '',
                lastModified: { date: '', by: '' },
            };
            console.log(form);
            this.subscriptions.push(this.formDesignerService.insertForm(form).subscribe(function (response) {
                if (response.status == 'ok') {
                }
                else {
                }
            }));
        }
    };
    FormAddnewComponent.prototype.UpdateForm = function () {
        // this.EditedFields = [];
        // this.EditedFields = this.SelectedForm.formFields.concat(this.inputFields);
        // let actionurl;
        // this.formActions.map(action => {
        //   if (action.actionType == this.createForm.get('actionType').value) {
        //     actionurl = action.actionUrl;
        //   }
        // });
        var _this = this;
        var obj = {
            nsp: this.nsp,
            formName: this.createForm.get('formName').value,
            formHeader: this.createForm.get('formHeader').value,
            formFooter: this.createForm.get('formFooter').value,
            actionType: this.createForm.get('actionType').value,
            actionUrl: this.createForm.get('actionUrl').value ? this.createForm.get('actionUrl').value : '',
            // actionUrl: this.createForm.get('actionType').value == "CustomUrl" ? this.createForm.get('actionUrl').value : actionurl,
            formFields: this.inputFields,
            // formFields: this.EditedFields && this.EditedFields.length ? this.EditedFields : this.SelectedForm.formFields,
            formHTML: '',
            lastModified: { date: '', by: '' },
        };
        console.log(obj);
        this.subscriptions.push(this.formDesignerService.UpdateForm(this.SelectedForm._id, obj).subscribe(function (response) {
            if (response.status == 'ok') {
                _this.editCase = false;
            }
        }));
    };
    FormAddnewComponent.prototype.moveUp = function (index) {
        if (index >= 1) {
            this.swap(this.inputFields, index, index - 1);
        }
        else {
            this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'No fields above, Not allowed!'
                },
                duration: 2000,
                panelClass: ['user-alert', 'warning']
            });
        }
    };
    FormAddnewComponent.prototype.moveDown = function (index) {
        if (index < (this.inputFields.length) - 1) {
            this.swap(this.inputFields, index, index + 1);
        }
        else {
            this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'No fields below, Not allowed!'
                },
                duration: 2000,
                panelClass: ['user-alert', 'warning']
            });
        }
    };
    FormAddnewComponent.prototype.swap = function (array, index1, index2) {
        var temp = array[index1];
        array[index1] = array[index2];
        array[index2] = temp;
    };
    FormAddnewComponent.prototype.CancelForm = function () {
        var _this = this;
        if (this.formChanges || (this.inputFields && this.inputFields.length)) {
            this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
                panelClass: ['confirmation-dialog'],
                data: { headermsg: 'Are you sure want to leave?' }
            }).afterClosed().subscribe(function (data) {
                if (data == 'ok') {
                    _this.formDesignerService.AddForm.next(false);
                    _this.formDesignerService.selectedForm.next(undefined);
                    _this.inputFields = [];
                }
                else {
                    return;
                }
            });
        }
        else {
            this.formDesignerService.AddForm.next(false);
            this.formDesignerService.selectedForm.next(undefined);
            this.inputFields = [];
        }
    };
    FormAddnewComponent.prototype.Preview = function () {
        if (this.inputFields && this.inputFields.length && this.inputFields[0].label) {
            var transformingObj = void 0;
            var formInitials = {
                formHeader: this.createForm.get('formHeader').value,
                formFooter: this.createForm.get('formFooter').value,
                formName: this.createForm.get('formName').value,
            };
            transformingObj = Object.assign([], formInitials, this.inputFields);
            this.dialog.open(preview_form_component_1.PreviewFormComponent, {
                panelClass: ['small-dialog'],
                disableClose: true,
                autoFocus: true,
                data: transformingObj
            }).afterClosed().subscribe(function (data) {
            });
        }
        else {
            this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'Preview not available, Add data to field first!'
                },
                duration: 3000,
                panelClass: ['user-alert', 'warning']
            });
            return;
        }
    };
    FormAddnewComponent.prototype.TransformConditions = function (conditions) {
        var _this = this;
        var fb = [];
        conditions.forEach(function (condition) {
            fb.push(_this.formbuilder.group({
                type: [condition.type,
                    []
                ],
                fieldName: [condition.fieldName,
                    [
                        forms_1.Validators.required,
                        forms_1.Validators.pattern(_this.whiteSpace),
                        forms_1.Validators.maxLength(50),
                        forms_1.Validators.minLength(2),
                    ]
                ],
                label: [condition.label,
                    [
                        forms_1.Validators.required,
                        forms_1.Validators.maxLength(50),
                        forms_1.Validators.minLength(2),
                    ]
                ],
                placeholder: [condition.placeholder,
                    [
                        // Validators.required,
                        forms_1.Validators.maxLength(50),
                        forms_1.Validators.minLength(2),
                    ]
                ],
                validation: [condition.validation, []],
                options: _this.fb.array([]),
                value: [condition.value, [
                        // Validators.required,
                        forms_1.Validators.maxLength(50),
                        forms_1.Validators.minLength(2),
                    ]
                ]
            }));
        });
        return fb;
    };
    FormAddnewComponent.prototype.TransformValues = function (options) {
        var _this = this;
        var fb = [];
        options.forEach(function (option) {
            fb.push(_this.formbuilder.group({
                key: [option.key,
                    [
                        forms_1.Validators.required
                    ]
                ],
                value: [option.value,
                    [
                        forms_1.Validators.required
                    ]
                ]
            }));
        });
        return fb;
    };
    FormAddnewComponent.prototype.ParseFormInput = function (inputForm) {
        var _this = this;
        var obj = {};
        var type = this.currentElement.id.split('_')[1];
        console.log(type);
        inputForm.controls.map(function (control, index) {
            switch (type) {
                case 'radio':
                    obj = {
                        id: _this.currentElement.id,
                        type: type,
                        fieldName: control.get('fieldName').value.toLowerCase(),
                        label: control.get('label').value,
                        validation: control.get('validation').value,
                        placeholder: '',
                        value: '',
                        options: _this.ParseValues(_this.createForm.controls['conditions'].controls[index].controls['options'])
                    };
                    break;
                case 'dropdown':
                    obj = {
                        id: _this.currentElement.id,
                        type: "dropdown",
                        fieldName: control.get('fieldName').value.toLowerCase(),
                        label: control.get('label').value,
                        placeholder: '',
                        validation: control.get('validation').value,
                        value: '',
                        options: _this.ParseValues(_this.createForm.controls['conditions'].controls[index].controls['options'])
                    };
                    break;
                case 'input':
                    obj = {
                        id: _this.currentElement.id,
                        type: control.get('type').value,
                        fieldName: control.get('fieldName').value.toLowerCase(),
                        label: control.get('label').value,
                        placeholder: control.get('placeholder').value ? control.get('placeholder').value : '',
                        validation: control.get('validation').value,
                        value: '',
                        options: [],
                    };
                    break;
                case 'checkbox':
                    obj = {
                        id: _this.currentElement.id,
                        type: "checkbox",
                        fieldName: control.get('fieldName').value.toLowerCase(),
                        label: control.get('label').value,
                        validation: control.get('validation').value,
                        placeholder: '',
                        value: control.get('value').value,
                        options: []
                    };
                    break;
                default:
                    obj = {};
            }
        });
        return obj;
    };
    FormAddnewComponent.prototype.ParseValues = function (formArray) {
        var formInputsOptions = [];
        formArray.controls.map(function (control) {
            var obj = {
                key: control.get('key').value ? control.get('key').value : '',
                value: control.get('value').value ? control.get('value').value : '',
            };
            formInputsOptions.push(obj);
        });
        return formInputsOptions;
    };
    FormAddnewComponent.prototype.ngOnDestroy = function () {
        this.formDesignerService.AddForm.next(false);
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    FormAddnewComponent.prototype.GetControls = function (name) {
        return this.createForm.get(name).controls;
    };
    FormAddnewComponent.prototype.patchValues = function (label, value) {
        return this.fb.group({
            key: [label],
            value: [value]
        });
    };
    FormAddnewComponent.prototype.deletekeyValue = function (index) {
        this.createForm.controls['conditions'].controls[0].controls['options'].removeAt(index);
    };
    FormAddnewComponent.prototype.addkeyValue = function () {
        var fg = this.fb.group({
            'key': ['', forms_1.Validators.compose([forms_1.Validators.required])],
            'value': ['', forms_1.Validators.compose([forms_1.Validators.required])]
        });
        this.createForm.controls['conditions'].controls[0].controls['options'].push(fg);
    };
    __decorate([
        core_1.Input()
    ], FormAddnewComponent.prototype, "FormObject", void 0);
    __decorate([
        core_1.ViewChild('previewDiv')
    ], FormAddnewComponent.prototype, "preivewDiv", void 0);
    FormAddnewComponent = __decorate([
        core_1.Component({
            selector: 'app-form-addnew',
            templateUrl: './form-addnew.component.html',
            styleUrls: ['./form-addnew.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], FormAddnewComponent);
    return FormAddnewComponent;
}());
exports.FormAddnewComponent = FormAddnewComponent;
//# sourceMappingURL=form-addnew.component.js.map