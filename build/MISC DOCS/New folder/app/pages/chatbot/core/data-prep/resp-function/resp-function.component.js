"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RespFunctionComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var confirmation_dialog_component_1 = require("../../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var RespFunctionComponent = /** @class */ (function () {
    function RespFunctionComponent(formbuilder, dialog, BotService) {
        var _this = this;
        this.dialog = dialog;
        this.BotService = BotService;
        this.resp_func_list = [];
        this.add = false;
        this.subscriptions = [];
        this.response_list = [];
        this.updatedResponse = '';
        this.updatedRespFunc = '';
        this.responseSelected = false;
        this.showResponseForm = false;
        this.showRespFunctionForm = false;
        this.selectedResponseFuncID = '';
        this.RespFunctionForm = formbuilder.group({
            'func_name': [null, forms_1.Validators.required]
        });
        this.ResponseForm = formbuilder.group({
            'response': [null, forms_1.Validators.required]
        });
        this.subscriptions.push(BotService.getRespFunc().subscribe(function (data) {
            _this.resp_func_list = data;
        }));
        this.subscriptions.push(BotService.getResponse().subscribe(function (data) {
            _this.response_list = data;
        }));
    }
    RespFunctionComponent.prototype.ngOnInit = function () {
    };
    RespFunctionComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    RespFunctionComponent.prototype.AddRespFunc = function (name) {
        this.BotService.addRespFunc(name);
        this.RespFunctionForm.reset();
    };
    RespFunctionComponent.prototype.editRespFunc = function (resp_func) {
        var _this = this;
        this.updatedRespFunc = '';
        this.resp_func_list.map(function (i) {
            if (i._id == resp_func._id) {
                i.editable = true;
                _this.updatedRespFunc = i.func_name;
                return i;
            }
        });
    };
    RespFunctionComponent.prototype.cancelEdit = function (resp_func) {
        this.resp_func_list.map(function (i) {
            if (i._id == resp_func._id) {
                i.editable = false;
                return i;
            }
        });
    };
    RespFunctionComponent.prototype.updateRespFunc = function (resp_func) {
        resp_func.editable = false;
        this.BotService.updateRespFunc(resp_func._id, this.updatedRespFunc);
        this.updatedRespFunc = '';
    };
    RespFunctionComponent.prototype.deleteRespFunc = function (resp_func, index) {
        var _this = this;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: "Are you sure to delete " + resp_func.func_name + " ?" }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this.BotService.deleteRespFunc(resp_func._id, index);
            }
        });
    };
    RespFunctionComponent.prototype.toggleRespFunctionForm = function () {
        this.showRespFunctionForm = !this.showRespFunctionForm;
    };
    RespFunctionComponent.prototype.togglesResponseForm = function () {
        this.showResponseForm = !this.showResponseForm;
    };
    RespFunctionComponent.prototype.showResponses = function (resp_func) {
        var _this = this;
        this.selectedResponseFuncID = resp_func._id;
        this.BotService.getResponses(resp_func._id);
        this.respID = resp_func._id;
        this.resp_func_list.map(function (i) {
            if (i._id == resp_func._id) {
                i.responses = true;
                _this.responseSelected = true;
                return i;
            }
            i.responses = false;
        });
    };
    RespFunctionComponent.prototype.AddResponse = function (response, id) {
        this.BotService.addResponse(response, id);
        this.ResponseForm.reset();
    };
    RespFunctionComponent.prototype.editResponse = function (response) {
        var _this = this;
        this.updatedResponse = '';
        this.response_list.map(function (i) {
            if (i.id == response.id) {
                _this.updatedResponse = i.text;
                i.editable = true;
                return i;
            }
        });
    };
    RespFunctionComponent.prototype.cancelEditResp = function (response) {
        this.response_list.map(function (i) {
            if (i.id == response.id) {
                i.editable = false;
                return i;
            }
        });
    };
    RespFunctionComponent.prototype.updateResponse = function (response) {
        response.editable = false;
        this.BotService.updateResponse(response, this.updatedResponse, this.respID);
        this.updatedResponse = '';
    };
    RespFunctionComponent.prototype.deleteResponse = function (response, index) {
        var _this = this;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: "Are you sure to delete " + response.text + " ?" }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this.BotService.deleteResponse(response.id, _this.respID, index);
            }
        });
    };
    RespFunctionComponent = __decorate([
        core_1.Component({
            selector: 'app-resp-function',
            templateUrl: './resp-function.component.html',
            styleUrls: ['./resp-function.component.css'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], RespFunctionComponent);
    return RespFunctionComponent;
}());
exports.RespFunctionComponent = RespFunctionComponent;
//# sourceMappingURL=resp-function.component.js.map