"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateRangePickerComponent = void 0;
var core_1 = require("@angular/core");
var DateRangePickerComponent = /** @class */ (function () {
    function DateRangePickerComponent() {
        this.to = this.customFormatter(new Date());
        this.from = this.customFormatter(this.SubtractDays(new Date(), 30));
        this.showButton = true;
        this.onDateChanged = new core_1.EventEmitter();
        this.submit = new core_1.EventEmitter();
        this.dates = {
            to: this.to,
            from: this.from
        };
        this.selectedType = '';
        this.showError = '';
        this.buttonSelected = 'month';
        this.initialized = false;
        this.datePickerConfig = {
            format: 'MM-DD-YYYY',
            unSelectOnClick: false,
            closeOnSelect: false,
            hideInputContainer: false,
            hideOnOutsideClick: false,
            showGoToCurrent: true
        };
    }
    DateRangePickerComponent.prototype.ngOnInit = function () {
    };
    DateRangePickerComponent.prototype.DateSelected = function (type) {
        if (type) {
            this.buttonSelected = type;
        }
        // console.log('Date Selected');
        switch (type) {
            case 'today':
                this.dates.from = this.customFormatter(new Date());
                this.dates.to = this.customFormatter(new Date());
                break;
            case 'yesterday':
                this.dates.from = this.customFormatter(this.SubtractDays(new Date(), 1));
                this.dates.to = this.customFormatter(this.SubtractDays(new Date(), 1));
                break;
            case 'week':
                this.dates.from = this.customFormatter(this.SubtractDays(new Date(), 7));
                this.dates.to = this.customFormatter(new Date());
                break;
            case 'month':
                this.dates.from = this.customFormatter(this.SubtractDays(new Date(), 30));
                this.dates.to = this.customFormatter(new Date());
                break;
            case 'pastsixmonths':
                this.dates.from = this.customFormatter(this.SubtractMonths(new Date(), 6));
                this.dates.to = this.customFormatter(new Date());
                break;
            default:
                break;
        }
        // console.log(this.dates);
        // this.onDateChanged.emit(this.dates);
        var from = new Date(this.dates.from);
        var to = new Date(this.dates.to);
        var status = false;
        if (from > to || to < from) {
            console.log('Invalid date!');
            this.showError = 'Invalid date!';
            status = false;
        }
        else {
            this.showError = '';
            status = true;
            // console.log(this.dates);		
        }
        this.onDateChanged.emit({ dates: this.dates, status: status });
    };
    // submit(){
    // 	let from = new Date(this.dates.from);
    // 	let to = new Date(this.dates.to);
    // 	if(from > to || to < from){
    // 		console.log('Invalid date!');
    // 		this.showError = 'Invalid date!'
    // 		setTimeout(() => {
    // 			this.showError = '';
    // 		}, 2000);
    // 	}else{
    // 		// console.log(this.dates);
    // 		this.onDateChanged.emit(this.dates);
    // 		this.changes = false;
    // 	}
    // }
    // cancel(){
    // 	// this.dates.to = this.to;
    // 	// this.dates.from = this.from;
    // 	let dates: any = {
    // 		from: this.from,
    // 		to: this.to
    // 	}
    // 	this.onDateChanged.emit(dates);
    // }
    DateRangePickerComponent.prototype.SubtractDays = function (date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() - days);
        return result;
    };
    DateRangePickerComponent.prototype.SubtractMonths = function (date, months) {
        var result = new Date(date);
        result.setMonth(result.getMonth() - months);
        return result;
    };
    DateRangePickerComponent.prototype.customFormatter = function (date) {
        return ("0" + (Number(date.getMonth()) + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2) + '-' + date.getFullYear();
    };
    DateRangePickerComponent.prototype.ngAfterViewInit = function () {
        //console.log('AfterViewInit');
        var _this = this;
        setTimeout(function () {
            setTimeout(function () {
                //console.log(this.fromElem.nativeElement as any);
                //console.log(this.toElem.nativeElement as any);
                _this.fromElem.nativeElement.focus();
                _this.toElem.nativeElement.focus();
            }, 0);
        }, 0);
    };
    DateRangePickerComponent.prototype.Show = function () {
        //console.log('Showing');
        this.fromElem.nativeElement.focus();
        this.toElem.nativeElement.focus();
    };
    DateRangePickerComponent.prototype.ngOnDestroy = function () {
        this.dates = {
            from: '',
            to: ''
        };
    };
    DateRangePickerComponent.prototype.Submit = function () {
        var from = new Date(this.dates.from);
        var to = new Date(this.dates.to);
        var status = false;
        if (from > to || to < from) {
            //console.log('Invalid date!');
            this.showError = 'Invalid date!';
            status = false;
        }
        else {
            this.showError = '';
            status = true;
            console.log(this.dates);
            this.submit.emit({ dates: this.dates, status: status });
            // console.log(this.dates);		
        }
    };
    __decorate([
        core_1.Input('to')
    ], DateRangePickerComponent.prototype, "to", void 0);
    __decorate([
        core_1.Input('from')
    ], DateRangePickerComponent.prototype, "from", void 0);
    __decorate([
        core_1.Input('showButton')
    ], DateRangePickerComponent.prototype, "showButton", void 0);
    __decorate([
        core_1.ViewChild('fromElem')
    ], DateRangePickerComponent.prototype, "fromElem", void 0);
    __decorate([
        core_1.ViewChild('toElem')
    ], DateRangePickerComponent.prototype, "toElem", void 0);
    __decorate([
        core_1.Output()
    ], DateRangePickerComponent.prototype, "onDateChanged", void 0);
    __decorate([
        core_1.Output()
    ], DateRangePickerComponent.prototype, "submit", void 0);
    DateRangePickerComponent = __decorate([
        core_1.Component({
            selector: 'app-date-range-picker',
            templateUrl: './date-range-picker.component.html',
            styleUrls: ['./date-range-picker.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], DateRangePickerComponent);
    return DateRangePickerComponent;
}());
exports.DateRangePickerComponent = DateRangePickerComponent;
//# sourceMappingURL=date-range-picker.component.js.map