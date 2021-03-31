"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChipsInputComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var ChipsInputComponent = /** @class */ (function () {
    function ChipsInputComponent(snackBar) {
        this.snackBar = snackBar;
        this.items = [];
        this.valueDisabled = false;
        this.maxTag = 0;
        this.autoCompleteList = [];
        this.delimiters = [];
        this.placeholder = "Enter Items . . .";
        this.errorMsg = "";
        this.onAdd = new core_1.EventEmitter();
        //itemList : Array<string> = []
        this.onRemove = new core_1.EventEmitter();
        this.showError = '';
        //#region Control Value Functions
        this.onChange = function () { };
        this.onTouch = function () { };
    }
    ChipsInputComponent_1 = ChipsInputComponent;
    ChipsInputComponent.prototype.ngOnInit = function () {
        // console.log(this.items);
    };
    ChipsInputComponent.prototype.DelimterPressed = function (keycode) {
        var found = false;
        this.delimiters.map(function (code) {
            if (code.toString() == keycode)
                found = true;
        });
        return found;
    };
    ChipsInputComponent.prototype.KeyDown = function (event, tag) {
        if (event.keyCode == 13 || this.DelimterPressed(event.key)) {
            event.stopImmediatePropagation();
            event.stopPropagation();
            event.preventDefault();
            return;
        }
        else if (event.keyCode == 8) {
            if (this.AddTag.nativeElement.value == '') {
                this.items.pop();
                this.onChange(this.items);
                this.onTouch(this.items);
            }
        }
    };
    ChipsInputComponent.prototype.Blur = function ($event, tag) {
        var _this = this;
        tag = tag.trim();
        event.stopImmediatePropagation();
        event.stopPropagation();
        if (!event.target.value) {
            event.preventDefault();
            return;
        }
        if (this.items && this.items.filter(function (data) { return data == tag; }).length > 0) {
            this.showError = '*Tag name already exists';
            this.AddTag.nativeElement.value = '';
            setTimeout(function () {
                _this.showError = '';
            }, 1500);
            return;
        }
        else {
            if (this.delimiters.length && this.delimiters.length == 1) {
                tag = tag.split(this.delimiters[0]);
            }
            else {
                tag = [tag];
            }
            tag.map(function (val) {
                if (_this.regex) {
                    if (_this.regex.test(val)) {
                        _this.items.push(val);
                        _this.onChange(_this.items);
                        _this.onTouch(_this.items);
                        _this.AddTag.nativeElement.value = '';
                    }
                    else {
                        _this.showError = _this.errorMsg; //'*Email is not valid';
                        _this.AddTag.nativeElement.value = '';
                        setTimeout(function () {
                            _this.showError = '';
                        }, 1500);
                        return;
                    }
                }
                else {
                    _this.items.push(val);
                    _this.onChange(_this.items);
                    _this.onTouch(_this.items);
                    _this.AddTag.nativeElement.value = '';
                }
            });
        }
    };
    ChipsInputComponent.prototype.Paste = function (event) {
        var _this = this;
        var clipboardData = event.clipboardData;
        var pastedText = clipboardData.getData('text');
        pastedText = pastedText.trim();
        event.stopImmediatePropagation();
        event.stopPropagation();
        if (this.items && this.items.filter(function (data) { return data == pastedText; }).length > 0) {
            this.showError = '*Tag name already exists';
            this.AddTag.nativeElement.value = '';
            setTimeout(function () {
                _this.showError = '';
            }, 1500);
            return;
        }
        else {
            if (this.delimiters.length && this.delimiters.length == 1) {
                pastedText = pastedText.split(this.delimiters[0]);
            }
            else {
                pastedText = [pastedText];
            }
            pastedText.map(function (val) {
                if (_this.regex) {
                    if (_this.regex.test(val)) {
                        _this.items.push(val);
                        _this.onChange(_this.items);
                        _this.onTouch(_this.items);
                        setTimeout(function () {
                            _this.AddTag.nativeElement.value = '';
                        }, 0);
                    }
                    else {
                        _this.showError = _this.errorMsg;
                        _this.AddTag.nativeElement.value = '';
                        setTimeout(function () {
                            _this.showError = '';
                        }, 1500);
                        return;
                    }
                }
                else {
                    _this.items.push(val);
                    _this.onChange(_this.items);
                    _this.onTouch(_this.items);
                    setTimeout(function () {
                        _this.AddTag.nativeElement.value = '';
                    }, 0);
                }
            });
        }
    };
    ChipsInputComponent.prototype.Keyup = function (event, tag) {
        var _this = this;
        tag = tag.trim();
        event.stopImmediatePropagation();
        event.stopPropagation();
        if (event.keyCode == 13 || this.DelimterPressed(event.key)) {
            if (!event.target.value) {
                event.preventDefault();
                return;
            }
            if (this.items && this.items.filter(function (data) { return data == tag; }).length > 0) {
                this.showError = '*Tag name already exists';
                this.AddTag.nativeElement.value = '';
                setTimeout(function () {
                    _this.showError = '';
                }, 1500);
                return;
            }
            else {
                if (this.regex) {
                    if (this.regex.test(tag)) {
                        this.items.push(tag);
                        this.onChange(this.items);
                        this.onTouch(this.items);
                        this.onAdd.emit(tag);
                        this.AddTag.nativeElement.value = '';
                    }
                    else {
                        this.showError = this.errorMsg;
                        this.AddTag.nativeElement.value = '';
                        setTimeout(function () {
                            _this.showError = '';
                        }, 1500);
                        return;
                    }
                }
                else {
                    this.items.push(tag);
                    this.onChange(this.items);
                    this.onTouch(this.items);
                    this.onAdd.emit(tag);
                    this.AddTag.nativeElement.value = '';
                }
            }
        }
    };
    ChipsInputComponent.prototype.onRemoveTag = function (tagIndex, items) {
        this.items.splice(tagIndex, 1);
        this.onChange(this.items);
        this.onTouch(this.items);
        this.onRemove.emit(tagIndex);
        //this.itemList = this.items;
    };
    // set itemList(val)  {
    //   this.itemList = this.items
    // }
    ChipsInputComponent.prototype.writeValue = function (value) {
        this.items;
    };
    // upon UI element value changes, this method gets triggered
    ChipsInputComponent.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    ChipsInputComponent.prototype.registerOnTouched = function (fn) {
        this.onTouch = fn;
    };
    var ChipsInputComponent_1;
    __decorate([
        core_1.Input('items')
    ], ChipsInputComponent.prototype, "items", void 0);
    __decorate([
        core_1.Input('valueDisabled')
    ], ChipsInputComponent.prototype, "valueDisabled", void 0);
    __decorate([
        core_1.Input('maxTag')
    ], ChipsInputComponent.prototype, "maxTag", void 0);
    __decorate([
        core_1.Input('autoCompleteList')
    ], ChipsInputComponent.prototype, "autoCompleteList", void 0);
    __decorate([
        core_1.Input('delimiters')
    ], ChipsInputComponent.prototype, "delimiters", void 0);
    __decorate([
        core_1.Input('placeholder')
    ], ChipsInputComponent.prototype, "placeholder", void 0);
    __decorate([
        core_1.Input('errorMsg')
    ], ChipsInputComponent.prototype, "errorMsg", void 0);
    __decorate([
        core_1.Input('regex')
    ], ChipsInputComponent.prototype, "regex", void 0);
    __decorate([
        core_1.Output()
    ], ChipsInputComponent.prototype, "onAdd", void 0);
    __decorate([
        core_1.Output()
    ], ChipsInputComponent.prototype, "onRemove", void 0);
    __decorate([
        core_1.ViewChild('box')
    ], ChipsInputComponent.prototype, "AddTag", void 0);
    ChipsInputComponent = ChipsInputComponent_1 = __decorate([
        core_1.Component({
            selector: 'app-chips-input',
            templateUrl: './chips-input.component.html',
            styleUrls: ['./chips-input.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            providers: [
                {
                    provide: forms_1.NG_VALUE_ACCESSOR,
                    useExisting: core_1.forwardRef(function () { return ChipsInputComponent_1; }),
                    multi: true
                }
            ]
        })
    ], ChipsInputComponent);
    return ChipsInputComponent;
}());
exports.ChipsInputComponent = ChipsInputComponent;
//# sourceMappingURL=chips-input.component.js.map