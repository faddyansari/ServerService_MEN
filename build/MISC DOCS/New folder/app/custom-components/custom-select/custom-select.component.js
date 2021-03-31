"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomSelectComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var Subject_1 = require("rxjs/Subject");
var CustomSelectComponent = /** @class */ (function () {
    function CustomSelectComponent() {
        var _this = this;
        this.scrollHeight = 0;
        //Inputs
        this.items = [];
        this.selectLabel = 'Select';
        this.bindLabel = '';
        this.bindValue = '';
        this.multiple = false;
        this.placement = 'bottom-left';
        this.search = true;
        this.lazyLoading = false;
        this.clearOnSubmit = false;
        // @Input('clearAll') clearAll: boolean = false;
        this._selectedItems = [];
        this.selectDisabled = false;
        //Outputs
        this.onSelect = new core_1.EventEmitter();
        this.onDeSelect = new core_1.EventEmitter();
        this.onLoadMore = new core_1.EventEmitter();
        this.onSearch = new core_1.EventEmitter();
        // @Output() ItemsAll = new EventEmitter();
        this.dropdownState = false;
        this.searchInput = new Subject_1.Subject();
        this.searchValue = '';
        this.fetchMore = false;
        //#region Control Value Functions
        this.onChange = function () {
            // console.log(this.selectedItems);
        };
        this.onTouch = function () { };
        this.searchInput.debounceTime(300).subscribe(function () {
            // console.log(this.searchValue);
            _this.onSearch.emit(_this.searchValue);
        });
    }
    CustomSelectComponent_1 = CustomSelectComponent;
    Object.defineProperty(CustomSelectComponent.prototype, "selectedItems", {
        get: function () {
            return this._selectedItems;
        },
        set: function (value) {
            if (!Array.isArray(value))
                value = [value];
            this._selectedItems = value;
        },
        enumerable: false,
        configurable: true
    });
    CustomSelectComponent.prototype.ngOnInit = function () {
        if (!Array.isArray(this.selectedItems))
            this.selectedItems = [this.selectedItems];
    };
    CustomSelectComponent.prototype.toggle = function () {
        var _this = this;
        this.dropdownState = !this.dropdownState;
        if (this.dropdownState) {
            // this.optionsPopper.show();
            setTimeout(function () {
                _this.scrollHeight = _this.scrollContainer.nativeElement.scrollHeight;
                // console.log(this.scrollHeight);
            }, 0);
        }
        else {
            // this.optionsPopper.hide();
            // this.optionsPopper.state = false;
        }
    };
    CustomSelectComponent.prototype.searchClicked = function (event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
    };
    CustomSelectComponent.prototype.ngAfterViewInit = function () {
        // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        // Add 'implements AfterViewInit' to the class.
        // this._agentService.getAllAgents();
        this.optionsPopper.state = false;
        this.selectedItems = JSON.parse(JSON.stringify(this.selectedItems));
        // this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
    };
    CustomSelectComponent.prototype.select = function (event, value) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        if (value) {
            if (!this.multiple) {
                this.selectedItems = [value];
                this.dropdownState = false;
            }
            else {
                if (!this.selectedItems.includes(value)) {
                    this.selectedItems.push(value);
                }
                // setTimeout(() => {
                // 	this.optionsPopper.show();
                // }, 0);
            }
        }
        else {
            if (!this.multiple) {
                this.selectedItems = [];
                this.dropdownState = false;
            }
        }
        this.onChange((this.multiple) ? this.selectedItems : (this.selectedItems.length) ? this.selectedItems[0] : '');
        this.onTouch((this.multiple) ? this.selectedItems : (this.selectedItems.length) ? this.selectedItems[0] : '');
        this.onSelect.emit((this.multiple) ? this.selectedItems : (this.selectedItems.length) ? this.selectedItems[0] : '');
        // this.ItemsAll.emit(((this.multiple) ? this.selectedItems : (this.selectedItems.length) ? this.selectedItems : '');
        if (!this.multiple)
            this.optionsPopper.hide();
        if (this.clearOnSubmit)
            this.selectedItems = [];
        else {
            this.selectedItems = this.selectedItems;
        }
    };
    CustomSelectComponent.prototype.remove = function (event, index) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        this.selectedItems.splice(index, 1);
        this.onDeSelect.emit(this.selectedItems);
        if (!this.optionsPopper.state) {
            this.optionsPopper.hide();
        }
        else {
            this.optionsPopper.show();
        }
    };
    CustomSelectComponent.prototype.clearAll = function () {
        this.selectedItems = [];
    };
    CustomSelectComponent.prototype.onScroll = function ($event) {
        if (this.lazyLoading) {
            if (Math.round(event.target.scrollTop + event.target.clientHeight) >= (this.scrollContainer.nativeElement.scrollHeight)) {
                //console.log('Scroll');
                // console.log('Fetch More');
                //Emit Load More
                this.onLoadMore.emit();
            }
            this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
        }
    };
    CustomSelectComponent.prototype.display = function (value) {
        if (this.selectedItems && this.selectedItems.includes(value)) {
            return false;
        }
        else {
            return true;
        }
    };
    CustomSelectComponent.prototype.forceClose = function (event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        this.optionsPopper.hide();
        this.dropdownState = false;
        this.optionsPopper.state = false;
    };
    // set itemList(val)  {
    //   this.itemList = this.items
    // }
    CustomSelectComponent.prototype.writeValue = function (value) {
        this.selectedItems;
    };
    // upon UI element value changes, this method gets triggered
    CustomSelectComponent.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    CustomSelectComponent.prototype.registerOnTouched = function (fn) {
        this.onTouch = fn;
    };
    var CustomSelectComponent_1;
    __decorate([
        core_1.ViewChild('scrollContainer')
    ], CustomSelectComponent.prototype, "scrollContainer", void 0);
    __decorate([
        core_1.ViewChild('optionsPopper')
    ], CustomSelectComponent.prototype, "optionsPopper", void 0);
    __decorate([
        core_1.Input('items')
    ], CustomSelectComponent.prototype, "items", void 0);
    __decorate([
        core_1.Input('selectLabel')
    ], CustomSelectComponent.prototype, "selectLabel", void 0);
    __decorate([
        core_1.Input('bindLabel')
    ], CustomSelectComponent.prototype, "bindLabel", void 0);
    __decorate([
        core_1.Input('bindValue')
    ], CustomSelectComponent.prototype, "bindValue", void 0);
    __decorate([
        core_1.Input('multiple')
    ], CustomSelectComponent.prototype, "multiple", void 0);
    __decorate([
        core_1.Input('placement')
    ], CustomSelectComponent.prototype, "placement", void 0);
    __decorate([
        core_1.Input('search')
    ], CustomSelectComponent.prototype, "search", void 0);
    __decorate([
        core_1.Input('lazyLoading')
    ], CustomSelectComponent.prototype, "lazyLoading", void 0);
    __decorate([
        core_1.Input('clearOnSubmit')
    ], CustomSelectComponent.prototype, "clearOnSubmit", void 0);
    __decorate([
        core_1.Input()
    ], CustomSelectComponent.prototype, "selectedItems", null);
    __decorate([
        core_1.Input('selectDisabled')
    ], CustomSelectComponent.prototype, "selectDisabled", void 0);
    __decorate([
        core_1.Output()
    ], CustomSelectComponent.prototype, "onSelect", void 0);
    __decorate([
        core_1.Output()
    ], CustomSelectComponent.prototype, "onDeSelect", void 0);
    __decorate([
        core_1.Output()
    ], CustomSelectComponent.prototype, "onLoadMore", void 0);
    __decorate([
        core_1.Output()
    ], CustomSelectComponent.prototype, "onSearch", void 0);
    CustomSelectComponent = CustomSelectComponent_1 = __decorate([
        core_1.Component({
            selector: 'app-custom-select',
            templateUrl: './custom-select.component.html',
            styleUrls: ['./custom-select.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            providers: [
                {
                    provide: forms_1.NG_VALUE_ACCESSOR,
                    useExisting: core_1.forwardRef(function () { return CustomSelectComponent_1; }),
                    multi: true
                }
            ]
        })
    ], CustomSelectComponent);
    return CustomSelectComponent;
}());
exports.CustomSelectComponent = CustomSelectComponent;
//# sourceMappingURL=custom-select.component.js.map