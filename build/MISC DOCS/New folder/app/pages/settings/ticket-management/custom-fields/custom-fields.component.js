"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomFieldsComponent = void 0;
var core_1 = require("@angular/core");
var CustomFieldsService_1 = require("../../../../../services/LocalServices/CustomFieldsService");
var forms_1 = require("@angular/forms");
var toast_notifications_component_1 = require("../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var CustomFieldsComponent = /** @class */ (function () {
    function CustomFieldsComponent(_customFieldService, formbuilder, _appStateService, _authService, _ticketAutomationSvc, snackBar) {
        var _this = this;
        this._customFieldService = _customFieldService;
        this.formbuilder = formbuilder;
        this._appStateService = _appStateService;
        this._authService = _authService;
        this._ticketAutomationSvc = _ticketAutomationSvc;
        this.snackBar = snackBar;
        this.whiteSpaceRegex = /^[^\s]+(\s+[^\s]+)*$/;
        this.subscriptions = [];
        this.customFields = [];
        this.saving = false;
        this.selectedIndex = -1;
        this.groupList = [];
        this.selectedGroups = [];
        this.DropdownSettings = {
            singleSelection: false,
            enableCheckAll: true,
            itemsShowLimit: 5,
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            allowSearchFilter: true
        };
        this.isDragged = false;
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Ticket Management');
        this.subscriptions.push(_authService.getPackageInfo().subscribe(function (pkg) {
            if (pkg) {
                _this.package = pkg.tickets.customFields;
                if (!_this.package.allowed) {
                    _this._appStateService.NavigateTo('/noaccess');
                }
            }
            // console.log(agent);
        }));
        this._customFieldService.CustomFields.subscribe(function (customFields) {
            if (customFields && customFields.length) {
                _this.customFields = customFields;
                //console.log('Custom Fields', this.customFields);
                _this.CustomFormFields = _this.formbuilder.group({
                    fields: _this.formbuilder.array(_this.TransformFields(_this.customFields))
                });
            }
        });
        this.subscriptions.push(this._authService.getSettings().subscribe(function (data) {
            if (data && data.permissions) {
                _this.customFieldPermissions = data.permissions.settings.ticketManagement.customFields;
            }
        }));
        this.subscriptions.push(this._ticketAutomationSvc.Groups.subscribe(function (data) {
            if (data) {
                _this.groupList = data.map(function (g) { return g.group_name; });
            }
        }));
    }
    CustomFieldsComponent.prototype.ngOnInit = function () {
    };
    CustomFieldsComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
        this._customFieldService.Destroy();
    };
    CustomFieldsComponent.prototype.TransformFields = function (fields) {
        var _this = this;
        var fb = [];
        fields.map(function (field) {
            fb.push(_this.formbuilder.group({
                label: [field.label, [forms_1.Validators.required, forms_1.Validators.pattern(_this.whiteSpaceRegex)]],
                name: [field.name, [forms_1.Validators.required, forms_1.Validators.pattern(_this.whiteSpaceRegex)]],
                type: [field.type, forms_1.Validators.required],
                isCollection: [field.isCollection, forms_1.Validators.required],
                required: [field.required, forms_1.Validators.required],
                default: [field.default, forms_1.Validators.required],
                elementType: [field.elementType, forms_1.Validators.required],
                options: [field.options],
                visibilityCriteria: [(field.visibilityCriteria) ? field.visibilityCriteria : 'all', forms_1.Validators.required],
                groupList: [(field.groupList) ? field.groupList : []]
            }));
        });
        return fb;
    };
    CustomFieldsComponent.prototype.TransformOptions = function (options) {
        //console.log(options);
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
    CustomFieldsComponent.prototype.GetFields = function () {
        return this.CustomFormFields.get('fields').controls;
    };
    CustomFieldsComponent.prototype.drag = function (event) {
        // event.preventDefault();
        // event.stopPropagation();
        // event.stopImmediatePropagation();
        // event.dataTransfer.setData("text", event.target.id);
        // console.log('Drage Start', event);
        event.dataTransfer.setData("text", event.target.id);
        //console.log('Drag Start', event.dataTransfer.getData("text"))
    };
    CustomFieldsComponent.prototype.drop = function (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        //console.log('Drop', event.dataTransfer.getData("text"));
        this.isDragged = false;
        // let el = document.getElementById(event.dataTransfer.getData("text"));
        // if (el) {
        //   el.draggable = false;
        // }
        this.AddField(event.dataTransfer.getData("text"));
        // var data = ev.dataTransfer.getData("text");
        // ev.target.appendChild(document.getElementById(data));
    };
    CustomFieldsComponent.prototype.CheckIfOptionAdded = function () {
        if (this.selectedField.get('elementType').value == 'dropdown' && !(this.selectedField.get('options').value.length)) {
            return true;
        }
        else
            return false;
    };
    CustomFieldsComponent.prototype.AddField = function (value) {
        var fb;
        console.log(value);
        switch (value.trim()) {
            case "checkbox":
                fb = this.formbuilder.group({
                    label: ['Checkbox', [forms_1.Validators.required, forms_1.Validators.pattern(this.whiteSpaceRegex)]],
                    name: [null, [forms_1.Validators.required, forms_1.Validators.pattern(this.whiteSpaceRegex)]],
                    type: ['boolean'],
                    isCollection: [false],
                    required: [false, forms_1.Validators.required],
                    default: [false, forms_1.Validators.required],
                    elementType: ['checkbox', forms_1.Validators.required],
                    options: [[]],
                    visibilityCriteria: ['all', forms_1.Validators.required],
                    groupList: [[]]
                });
                break;
            case "radio":
                fb = this.formbuilder.group({
                    label: ['Radio Button', [forms_1.Validators.required, forms_1.Validators.pattern(this.whiteSpaceRegex)]],
                    name: [null, [forms_1.Validators.required, forms_1.Validators.pattern(this.whiteSpaceRegex)]],
                    type: ['boolean'],
                    isCollection: [false, forms_1.Validators.required],
                    required: [false, forms_1.Validators.required],
                    default: [false, forms_1.Validators.required],
                    elementType: ['radio', forms_1.Validators.required],
                    options: [[]],
                    visibilityCriteria: ['all', forms_1.Validators.required],
                    groupList: [[]]
                });
                break;
            case "date":
                fb = this.formbuilder.group({
                    label: ['Datebox', [forms_1.Validators.required, forms_1.Validators.pattern(this.whiteSpaceRegex)]],
                    name: [null, [forms_1.Validators.required, forms_1.Validators.pattern(this.whiteSpaceRegex)]],
                    type: ['string'],
                    isCollection: [false],
                    required: [false, forms_1.Validators.required],
                    default: [false, forms_1.Validators.required],
                    elementType: ['date', forms_1.Validators.required],
                    options: [[]],
                    visibilityCriteria: ['all', forms_1.Validators.required],
                    groupList: [[]]
                });
                break;
            case "textbox":
                fb = this.formbuilder.group({
                    label: ['Textbox', [forms_1.Validators.required, forms_1.Validators.pattern(this.whiteSpaceRegex)]],
                    name: [null, [forms_1.Validators.required, forms_1.Validators.pattern(this.whiteSpaceRegex)]],
                    type: ['string'],
                    isCollection: [false],
                    required: [false, forms_1.Validators.required],
                    default: [false, forms_1.Validators.required],
                    elementType: ['textbox', forms_1.Validators.required],
                    options: [[]],
                    visibilityCriteria: ['all', forms_1.Validators.required],
                    groupList: [[]]
                });
                break;
            case "dropdown":
                fb = this.formbuilder.group({
                    label: ['Select Option', [forms_1.Validators.required, forms_1.Validators.pattern(this.whiteSpaceRegex)]],
                    name: [null, [forms_1.Validators.required, forms_1.Validators.pattern(this.whiteSpaceRegex)]],
                    type: ['string'],
                    isCollection: [false],
                    required: [false, forms_1.Validators.required],
                    default: [false, forms_1.Validators.required],
                    elementType: ['dropdown', forms_1.Validators.required],
                    options: [[]],
                    visibilityCriteria: ['all', forms_1.Validators.required],
                    groupList: [[]]
                });
                break;
        }
        var fields = this.CustomFormFields.get('fields');
        fields.push(fb);
    };
    CustomFieldsComponent.prototype.SetEdit = function (i) {
        var fields = this.CustomFormFields.get('fields');
        fields.controls[i].value;
        this.selectedIndex = i;
        //console.log('Set Edit', fields.controls[i].value.options)
        this.selectedGroups = (fields.controls[i].value.groupList) ? fields.controls[i].value.groupList : [];
        this.selectedField = this.formbuilder.group({
            label: [fields.controls[i].value.label, [forms_1.Validators.required, forms_1.Validators.pattern(this.whiteSpaceRegex)]],
            name: [fields.controls[i].value.name, [forms_1.Validators.required, forms_1.Validators.pattern(this.whiteSpaceRegex)]],
            type: [fields.controls[i].value.type],
            isCollection: [fields.controls[i].value.isCollection],
            required: [fields.controls[i].value.required, forms_1.Validators.required],
            default: [false, forms_1.Validators.required],
            elementType: [fields.controls[i].value.elementType, forms_1.Validators.required],
            options: this.formbuilder.array(this.TransformOptions(fields.controls[i].value.options)),
            visibilityCriteria: [(fields.controls[i].value.visibilityCriteria) ? fields.controls[i].value.visibilityCriteria : 'all', forms_1.Validators.required],
            groupList: [(fields.controls[i].value.groupList) ? fields.controls[i].value.groupList : []]
        });
    };
    CustomFieldsComponent.prototype.moveUp = function (index) {
        if (this.CustomFormFields.controls['fields'].controls[index - 1].controls['default'].value) {
            this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    msg: 'Cannot swap with default fields!',
                    img: 'warning'
                },
                duration: 2000,
                panelClass: ['user-alert', 'warning']
            });
            return;
        }
        if (index >= 1) {
            this.swap(this.CustomFormFields.get('fields').controls, index, index - 1);
        }
        else {
            this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    msg: 'No fields above, Not allowed!',
                    img: 'warning'
                },
                duration: 2000,
                panelClass: ['user-alert', 'warning']
            });
        }
    };
    CustomFieldsComponent.prototype.moveDown = function (index) {
        if (index < this.CustomFormFields.get('fields').length - 1) {
            this.swap(this.CustomFormFields.get('fields').controls, index, index + 1);
        }
        else {
            this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    msg: 'No fields below, Not allowed!',
                    img: 'warning'
                },
                duration: 2000,
                panelClass: ['user-alert', 'warning']
            });
        }
    };
    CustomFieldsComponent.prototype.swap = function (array, index1, index2) {
        var temp = array[index1];
        array[index1] = array[index2];
        array[index2] = temp;
    };
    CustomFieldsComponent.prototype.SaveField = function () {
        var fields = this.CustomFormFields.get('fields');
        var obj = this.selectedField.value;
        obj.groupList = this.selectedGroups;
        fields.at(this.selectedIndex).patchValue(obj);
        //fields.at(this.selectedIndex).get('options').patchValue(this.formbuilder.array(this.TransformOptions(this.selectedField.get('options').value)));
        // console.log('selectedField Value : ', this.selectedField.value);
        // console.log('Fields : ', fields)
        this.selectedField = undefined;
    };
    CustomFieldsComponent.prototype.DeleteField = function (i) {
        var fields = this.CustomFormFields.get('fields');
        fields.removeAt(i);
        this.selectedField = undefined;
        this.selectedIndex = -1;
    };
    CustomFieldsComponent.prototype.allowDrop = function (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        this.isDragged = true;
    };
    CustomFieldsComponent.prototype.DragLeave = function (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        this.isDragged = false;
        //console.log('Drag End');
    };
    CustomFieldsComponent.prototype.AddOption = function () {
        var fb = this.formbuilder.group({
            name: ['', [forms_1.Validators.required, forms_1.Validators.pattern(this.whiteSpaceRegex)]],
            value: ['', [forms_1.Validators.required, forms_1.Validators.pattern(this.whiteSpaceRegex)]],
        });
        var options = this.selectedField.get('options');
        options.push(fb);
    };
    CustomFieldsComponent.prototype.GetOptionsDisplay = function (field) {
        var fa = field.get('options');
        //console.log(field);
        return fa.controls;
    };
    CustomFieldsComponent.prototype.DeleteOption = function (i) {
        var fa = this.selectedField.get('options');
        fa.removeAt(i);
    };
    CustomFieldsComponent.prototype.GetOptions = function () {
        return this.selectedField.get('options').controls;
    };
    CustomFieldsComponent.prototype.Clear = function () {
        this.selectedField = undefined;
        this.selectedIndex = -1;
    };
    CustomFieldsComponent.prototype.SubmitForm = function () {
        // console.log(this.selectedField);
        var _this = this;
        this.saving = true;
        this._customFieldService.UpdateFields({ 'fields': this.ParseFields(this.CustomFormFields.get('fields')) }).subscribe(function (res) {
            _this.saving = false;
            if (res.status == 'ok') {
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
            _this.saving = false;
            _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'Unable to Update Field!'
                },
                duration: 2000,
                panelClass: ['user-alert', 'error']
            });
        });
    };
    CustomFieldsComponent.prototype.ParseFields = function (fields) {
        var field = [];
        fields.controls.map(function (control) {
            var obj = {
                label: control.get('label').value,
                name: control.get('name').value,
                type: control.get('type').value,
                isCollection: control.get('isCollection').value,
                required: control.get('required').value,
                default: control.get('default').value,
                elementType: control.get('elementType').value,
                options: control.get('options').value,
                visibilityCriteria: control.get('visibilityCriteria').value,
                groupList: control.get('groupList').value
            };
            field.push(obj);
        });
        return field;
    };
    CustomFieldsComponent = __decorate([
        core_1.Component({
            selector: 'app-custom-fields',
            templateUrl: './custom-fields.component.html',
            styleUrls: ['./custom-fields.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            providers: [
                CustomFieldsService_1.CustomFieldsService
            ]
        })
    ], CustomFieldsComponent);
    return CustomFieldsComponent;
}());
exports.CustomFieldsComponent = CustomFieldsComponent;
//# sourceMappingURL=custom-fields.component.js.map