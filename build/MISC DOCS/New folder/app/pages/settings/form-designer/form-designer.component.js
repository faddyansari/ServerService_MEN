"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormDesignerComponent = void 0;
var core_1 = require("@angular/core");
var FormDesignerService_1 = require("../../../../services/LocalServices/FormDesignerService");
var FormDesignerComponent = /** @class */ (function () {
    function FormDesignerComponent(_authService, _formDesignerService, _appStateService) {
        var _this = this;
        this._authService = _authService;
        this._formDesignerService = _formDesignerService;
        this._appStateService = _appStateService;
        this.subscriptions = [];
        this.addForm = true;
        this.editForm = true;
        this.SelectedForm = undefined;
        this.Agent = undefined;
        this.newObject = undefined;
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Ticket Management');
        this.subscriptions.push(_authService.getPackageInfo().subscribe(function (pkg) {
            if (pkg) {
                _this.package = pkg.tickets.formDesigner;
                if (!_this.package.allowed) {
                    _this._appStateService.NavigateTo('/noaccess');
                }
            }
        }));
        this.subscriptions.push(this._formDesignerService.AddForm.subscribe(function (value) {
            _this.addForm = value;
        }));
        this.subscriptions.push(this._formDesignerService.selectedForm.subscribe(function (value) {
            _this.SelectedForm = value;
        }));
        this.Agent = this._formDesignerService.Agent;
        this.newObject = {
            nsp: '',
            formFooter: '',
            formHeader: '',
            actionType: '',
            actionUrl: '',
            formName: '',
            formHtml: '',
            formFields: [{
                    type: 'text',
                    id: "",
                    fieldName: "",
                    label: "",
                    value: "",
                    validation: false,
                    placeholder: '',
                    options: [{
                            key: '',
                            value: ''
                        }],
                }],
            lastmodified: { date: new Date().toISOString(), by: '' },
        };
    }
    FormDesignerComponent.prototype.ngOnInit = function () {
    };
    FormDesignerComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        //this._formDesignerService.Destroy();
    };
    FormDesignerComponent.prototype.AddForm = function () {
        this._formDesignerService.AddForm.next(true);
    };
    FormDesignerComponent = __decorate([
        core_1.Component({
            selector: 'app-form-designer',
            templateUrl: './form-designer.component.html',
            styleUrls: ['./form-designer.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            providers: [
                FormDesignerService_1.FormDesignerService
            ]
        })
    ], FormDesignerComponent);
    return FormDesignerComponent;
}());
exports.FormDesignerComponent = FormDesignerComponent;
//# sourceMappingURL=form-designer.component.js.map