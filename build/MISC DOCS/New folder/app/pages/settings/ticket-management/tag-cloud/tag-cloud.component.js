"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagCloudComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var toast_notifications_component_1 = require("../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var TagCloudComponent = /** @class */ (function () {
    function TagCloudComponent(_appStateService, formbuilder, _tagService, snackBar) {
        var _this = this;
        this._appStateService = _appStateService;
        this.formbuilder = formbuilder;
        this._tagService = _tagService;
        this.snackBar = snackBar;
        this.showForm = false;
        this.editCase = false;
        this.index = '';
        this.tagList = [];
        this.subscriptions = [];
        this.SortBy = ['Ascending Order', 'Descending Order'];
        this.tagPattern = /^[ \t]*#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z])[ \t]*((,)?#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z]))*$/;
        this.searchValue = '';
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Ticket Management');
        this.subscriptions.push(this._tagService.Tags.subscribe(function (res) {
            if (res && res.length) {
                _this.tagList = res;
            }
        }));
    }
    TagCloudComponent.prototype.ngOnInit = function () {
        this.tagForm = this.formbuilder.group({
            'hashTag': [
                null,
                [
                    forms_1.Validators.required,
                    forms_1.Validators.pattern(/^[ \t]*#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z])[ \t]*((,)?#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z]))*$/),
                    forms_1.Validators.maxLength(32)
                ],
            ]
        });
    };
    TagCloudComponent.prototype.DeleteTag = function (i) {
        if (this.tagList && this.tagList.length) {
            this.tagList.splice(i, 1);
            this._tagService.deleteTag(this.tagList);
        }
    };
    TagCloudComponent.prototype.AddTag = function () {
        this.tagForm.reset();
        this.editCase = false;
        this.showForm = !this.showForm;
    };
    TagCloudComponent.prototype.RemoveDuplicateTags = function (array) {
        var arr = {};
        array.map(function (value) { if (value.trim())
            arr[value] = value.trim(); });
        return Object.keys(arr);
    };
    TagCloudComponent.prototype.insertTag = function () {
        var hashTag = this.tagForm.get('hashTag').value;
        var commaseparatedTags = this.RemoveDuplicateTags(hashTag.split(','));
        if ((commaseparatedTags && commaseparatedTags.length == 1) && (this.tagList && this.tagList.filter(function (data) { return data == commaseparatedTags[0]; }).length > 0)) {
            this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'Tag already exists!'
                },
                duration: 3000,
                panelClass: ['user-alert', 'error']
            });
            this.showForm = false;
            return;
        }
        else {
            // commaseparatedTags = this.RemoveDuplicateTags(commaseparatedTags);
            if (commaseparatedTags && commaseparatedTags.length) {
                if (this.tagList && !this.tagList.length)
                    this.tagList = [];
                this.tagList = this.tagList.concat(commaseparatedTags);
                // commaseparatedTags.map(single=>{
                //   this.tagList.push({ tag_name: single, count: 0, ticketRef: [] });
                // })
                this._tagService.insertTag(this.tagList);
            }
        }
        this.showForm = false;
    };
    TagCloudComponent.prototype.updateTag = function (tag, i) {
        this.index = i;
        this.editCase = true;
        this.showForm = true;
        this.tagForm.get('hashTag').setValue(tag);
    };
    TagCloudComponent.prototype.EditTag = function () {
        this.tagList[this.index] = this.tagForm.get('hashTag').value;
        this._tagService.UpdateTag(this.tagList);
        this.showForm = false;
        this.editCase = false;
    };
    TagCloudComponent.prototype.Sortby = function (val) {
        this._tagService.sort(val);
        this.sortPopper.hide();
    };
    __decorate([
        core_1.ViewChild('sortPopper')
    ], TagCloudComponent.prototype, "sortPopper", void 0);
    TagCloudComponent = __decorate([
        core_1.Component({
            selector: 'app-tag-cloud',
            templateUrl: './tag-cloud.component.html',
            styleUrls: ['./tag-cloud.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], TagCloudComponent);
    return TagCloudComponent;
}());
exports.TagCloudComponent = TagCloudComponent;
//# sourceMappingURL=tag-cloud.component.js.map