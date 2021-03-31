"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconCustomerRegistationComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var confirmation_dialog_component_1 = require("../../dialogs/confirmation-dialog/confirmation-dialog.component");
var IconCustomerRegistationComponent = /** @class */ (function () {
    function IconCustomerRegistationComponent(formbuilder, dialog, _iconService) {
        var _this = this;
        this.formbuilder = formbuilder;
        this.dialog = dialog;
        this._iconService = _iconService;
        this.emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.whiteSpaceRegex = /^[^\s]+(\s+[^\s]+)*$/;
        this.phoneNumberRegex = /^([+]{1})?\d+$/;
        this.numbersOnlyRegex = /^[0-9]*$/;
        this.customerId = '';
        this.agentEmail = '';
        this.CustomerInfo = undefined;
        this.RelatedCustomerInfo = undefined;
        this.loadingReg = false;
        /**OUTPUTS */
        this.registrationData = new core_1.EventEmitter();
        /** ALL BOOLEANS HERE */
        this.addNewNumber = false;
        this.addNewEmail = false;
        this.checkBoxPhone = false;
        this.checkBoxEmail = false;
        this.pill1 = true;
        this.pill2 = false;
        /**MISC */
        this.agent = undefined;
        /** ALL ARRAYS OF MASTER DATA */
        this.destCountryCodesList = [];
        this.portList = [];
        this.customerTypeList = [];
        this.phoneIDList = [];
        this.SalesEmployeeList = [];
        this.autoPort = [];
        this.otherPorts = [
            {
                "ItemCode": 53,
                "ItemName": "DAR-ES-SALAAM",
                "CountryId": 362
            },
            {
                "ItemCode": 424,
                "ItemName": "MATADI",
                "CountryId": 362
            },
            {
                "ItemCode": 114,
                "ItemName": "NOVOROSSIYSK",
                "CountryId": 385
            },
            {
                "ItemCode": 53,
                "ItemName": "DAR-ES-SALAAM",
                "CountryId": 90
            },
            {
                "ItemCode": 53,
                "ItemName": "DAR-ES-SALAAM",
                "CountryId": 205
            },
            {
                "ItemCode": 53,
                "ItemName": "DAR-ES-SALAAM",
                "CountryId": 227
            },
            {
                "ItemCode": 52,
                "ItemName": "MOMBASA",
                "CountryId": 227
            },
            {
                "ItemCode": 176,
                "ItemName": "DAKAR",
                "CountryId": 309
            },
            {
                "ItemCode": 175,
                "ItemName": "COTONOU",
                "CountryId": 258
            },
            {
                "ItemCode": 175,
                "ItemName": "COTONOU",
                "CountryId": 320
            },
            {
                "ItemCode": 53,
                "ItemName": "DAR-ES-SALAAM",
                "CountryId": 71
            },
            {
                "ItemCode": 443,
                "ItemName": "THE VALLEY",
                "CountryId": 167
            },
            {
                "ItemCode": 86,
                "ItemName": "IQUIQUE",
                "CountryId": 94
            },
            {
                "ItemCode": 54,
                "ItemName": "DURBAN",
                "CountryId": 230
            },
            {
                "ItemCode": 52,
                "ItemName": "MOMBASA",
                "CountryId": 71
            },
            {
                "ItemCode": 53,
                "ItemName": "DAR-ES-SALAAM",
                "CountryId": 126
            },
            {
                "ItemCode": 53,
                "ItemName": "DAR-ES-SALAAM",
                "CountryId": 68
            },
            {
                "ItemCode": 53,
                "ItemName": "DAR-ES-SALAAM",
                "CountryId": 92
            },
            {
                "ItemCode": 54,
                "ItemName": "DURBAN",
                "CountryId": 92
            },
            {
                "ItemCode": 54,
                "ItemName": "DURBAN",
                "CountryId": 229
            },
            {
                "ItemCode": 54,
                "ItemName": "DURBAN",
                "CountryId": 58
            }
        ];
        this._iconService.GetMasterData(1).subscribe(function (result) {
            if (result) {
                _this.destCountryCodesList = result.MasterData;
            }
        });
        this._iconService.GetMasterData(2).subscribe(function (result) {
            if (result) {
                _this.portList = result.MasterData;
            }
        });
        this._iconService.GetMasterData(3).subscribe(function (result) {
            if (result) {
                _this.customerTypeList = result.MasterData;
            }
        });
        this._iconService.GetMasterData(4).subscribe(function (result) {
            if (result) {
                _this.phoneIDList = result.MasterData;
            }
        });
        this._iconService.GetMasterData(19).subscribe(function (result) {
            if (result) {
                _this.SalesEmployeeList = result.MasterData;
            }
        });
        this.registerCustomerForm = this.formbuilder.group({
            'customerName': ['', [forms_1.Validators.required, forms_1.Validators.maxLength(100), forms_1.Validators.pattern(this.whiteSpaceRegex)]],
            'firstName': ['', [forms_1.Validators.maxLength(100), forms_1.Validators.pattern(this.whiteSpaceRegex)]],
            'lastName': ['', [forms_1.Validators.maxLength(100), forms_1.Validators.pattern(this.whiteSpaceRegex)]],
            'destCountryCode': ['', [forms_1.Validators.required]],
            'arrivalPortId': ['', [forms_1.Validators.required]],
            'customerTypeId': ['', [forms_1.Validators.required]],
            'salePersonUserCode': ['', [forms_1.Validators.required]],
            'contactPhoneTypeId': ['', [forms_1.Validators.required]],
            'contactPhoneNumber': this.formbuilder.array(this.TransformPhoneNumber('')),
            'contactMailEmailAddress': this.formbuilder.array(this.TransformEmailAddress('')),
            'homePageOnFlg': ['1', [forms_1.Validators.required]],
            'myPageOnFlg': ['1', [forms_1.Validators.required]],
            'bulkEmailFlg': ['1', [forms_1.Validators.required]],
            'bulkEmailStockListFlg': ['1', [forms_1.Validators.required]]
        });
    }
    Object.defineProperty(IconCustomerRegistationComponent.prototype, "countryName", {
        get: function () {
            return this._countryName;
        },
        /**INPUTS */
        set: function (value) {
            var _this = this;
            this._countryName = value;
            this.registerCustomerForm.get('destCountryCode').setValue(this._countryName);
            if (this.registerCustomerForm.get('destCountryCode').value != '') {
                this._iconService.GetMasterData(2).subscribe(function (result) {
                    if (result) {
                        _this.portList = result.MasterData;
                        _this.GetPortList();
                    }
                });
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(IconCustomerRegistationComponent.prototype, "visitorName", {
        get: function () {
            return this._visitorName;
        },
        set: function (value) {
            this._visitorName = value;
            this.registerCustomerForm.get('customerName').setValue(this._visitorName);
            this.registerCustomerForm.get('firstName').setValue(this._visitorName);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(IconCustomerRegistationComponent.prototype, "visitorPhone", {
        get: function () {
            return this._visitorPhone;
        },
        set: function (value) {
            this._visitorPhone = value;
            this.registerCustomerForm.get('contactPhoneNumber').controls[0].get('number').setValue(this._visitorPhone);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(IconCustomerRegistationComponent.prototype, "visitorEmail", {
        get: function () {
            return this._visitorEmail;
        },
        set: function (value) {
            this._visitorEmail = value;
            this.registerCustomerForm.get('contactMailEmailAddress').controls[0].get('address').setValue(this._visitorEmail);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(IconCustomerRegistationComponent.prototype, "agentName", {
        get: function () {
            return this._agentName;
        },
        set: function (value) {
            this._agentName = value;
            this.registerCustomerForm.get('salePersonUserCode').setValue(this._agentName);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(IconCustomerRegistationComponent.prototype, "selectedThreadId", {
        get: function () {
            return this._selectedThreadId;
        },
        set: function (value) {
            var _this = this;
            this._selectedThreadId = value;
            this.registerCustomerForm.get('customerName').setValue(this._visitorName);
            this.registerCustomerForm.get('firstName').setValue(this._visitorName);
            this.registerCustomerForm.get('destCountryCode').setValue(this._countryName);
            if (this.registerCustomerForm.get('destCountryCode').value != '') {
                this._iconService.GetMasterData(2).subscribe(function (result) {
                    if (result) {
                        _this.portList = result.MasterData;
                        _this.GetPortList();
                    }
                });
            }
            this.registerCustomerForm.get('lastName').setValue('');
            this.registerCustomerForm.get('customerTypeId').setValue('');
            this.registerCustomerForm.get('contactPhoneTypeId').setValue('');
            this.registerCustomerForm.get('homePageOnFlg').setValue('1');
            this.registerCustomerForm.get('myPageOnFlg').setValue('1');
            this.registerCustomerForm.get('bulkEmailFlg').setValue('1');
            this.registerCustomerForm.get('bulkEmailStockListFlg').setValue('1');
            this.registerCustomerForm.get('salePersonUserCode').setValue(this._agentName);
            this.registerCustomerForm.get('contactPhoneNumber').controls[0].get('number').setValue(this._visitorPhone);
            this.registerCustomerForm.get('contactMailEmailAddress').controls[0].get('address').setValue(this._visitorEmail);
        },
        enumerable: false,
        configurable: true
    });
    IconCustomerRegistationComponent.prototype.ngOnInit = function () {
        if (this.permissions.canRegisterIconCustomer)
            this.pill1 = true;
        else if (this.permissions.canSeeRegisteredIconCustomer)
            this.pill1 = true;
        else
            this.pill2 = true;
    };
    IconCustomerRegistationComponent.prototype.TransformPhoneNumber = function (visitorPhone) {
        var fb = [];
        fb.push(this.formbuilder.group({
            number: [visitorPhone,
                [forms_1.Validators.pattern(this.phoneNumberRegex),
                    forms_1.Validators.required]],
            isDefaultPN: [false, []]
        }));
        return fb;
    };
    IconCustomerRegistationComponent.prototype.GetControls = function (name) {
        return this.registerCustomerForm.get(name).controls;
    };
    IconCustomerRegistationComponent.prototype.ParseEmailAddress = function (formArray) {
        var arr = [];
        formArray.controls.map(function (control) {
            if (control.get('isDefault').value) {
                arr.unshift(control.get('address').value);
            }
            else {
                arr.push(control.get('address').value);
            }
        });
        var str = arr.join(';');
        return str;
    };
    IconCustomerRegistationComponent.prototype.ParsePhoneNumber = function (formArray) {
        var arr = [];
        formArray.controls.map(function (control) {
            if (control.get('isDefaultPN').value) {
                arr.unshift(control.get('number').value);
            }
            else {
                arr.push(control.get('number').value);
            }
        });
        var str = arr.join(';');
        return str;
    };
    IconCustomerRegistationComponent.prototype.AddPhoneNumber = function () {
        this.addNewNumber = true;
        var fb = this.formbuilder.group({
            number: ['', [forms_1.Validators.pattern(this.phoneNumberRegex),
                    forms_1.Validators.required]],
            isDefaultPN: [false]
        });
        var phNumber = this.registerCustomerForm.get('contactPhoneNumber');
        phNumber.push(fb);
    };
    IconCustomerRegistationComponent.prototype.DeletePhoneNumber = function (index) {
        var number = this.registerCustomerForm.get('contactPhoneNumber');
        number.removeAt(index);
    };
    IconCustomerRegistationComponent.prototype.TransformEmailAddress = function (value) {
        var fb = [];
        fb.push(this.formbuilder.group({
            address: [value,
                [forms_1.Validators.pattern(this.emailPattern),
                    forms_1.Validators.required]],
            isDefault: [false, []]
        }));
        return fb;
    };
    IconCustomerRegistationComponent.prototype.AddEmailAddress = function () {
        this.addNewEmail = true;
        var fb = this.formbuilder.group({
            address: ['', [forms_1.Validators.pattern(this.emailPattern),
                    forms_1.Validators.required]],
            isDefault: [false]
        });
        var phNumber = this.registerCustomerForm.get('contactMailEmailAddress');
        phNumber.push(fb);
    };
    IconCustomerRegistationComponent.prototype.DeleteEmailAddress = function (index) {
        var number = this.registerCustomerForm.get('contactMailEmailAddress');
        number.removeAt(index);
    };
    IconCustomerRegistationComponent.prototype.OnChange = function (event, index) {
        this.checkBoxPhone = true;
        this.registerCustomerForm.controls['contactPhoneNumber'].controls[index].controls['isDefaultPN'].setValue(event.target.checked);
    };
    IconCustomerRegistationComponent.prototype.OnChangeEmail = function (event, index) {
        this.checkBoxEmail = true;
        this.registerCustomerForm.controls['contactMailEmailAddress'].controls[index].controls['isDefault'].setValue(event.target.checked);
    };
    IconCustomerRegistationComponent.prototype.CheckDefaultEmail = function () {
        if (((this.registerCustomerForm.get('contactMailEmailAddress').controls.length > 1)
            && (this.registerCustomerForm.get('contactMailEmailAddress').value.every(function (val) { return !val.isDefault; })))) {
            return true;
        }
        else
            return false;
    };
    IconCustomerRegistationComponent.prototype.CheckCustomerId = function () {
        if (this.customerId) {
            return true;
        }
        else {
            return false;
        }
    };
    IconCustomerRegistationComponent.prototype.ValidateCustomerId = function () {
        if (!this.customerId) {
            return true;
        }
        if (this.customerId.length < 7) {
            return true;
        }
        if (!this.whiteSpaceRegex.test(this.customerId)) {
            return true;
        }
        if (!this.numbersOnlyRegex.test(this.customerId)) {
            return true;
        }
    };
    IconCustomerRegistationComponent.prototype.CheckDefaultPhone = function () {
        if (((this.registerCustomerForm.get('contactPhoneNumber').controls.length > 1)
            && (this.registerCustomerForm.get('contactPhoneNumber').value.every(function (val) { return !val.isDefaultPN; })))) {
            return true;
        }
        else
            return false;
    };
    IconCustomerRegistationComponent.prototype.setPillActive = function (pill) {
        switch (pill) {
            case 'pill1':
                this.pill1 = true;
                this.pill2 = false;
                break;
            case 'pill2':
                this.pill1 = false;
                this.pill2 = true;
                break;
        }
    };
    IconCustomerRegistationComponent.prototype.ParseSalesPerson = function (name) {
        var str = '';
        this.SalesEmployeeList.map(function (res) {
            if (res.EmployeeName == name) {
                str = res.EmployeeId;
            }
        });
        return str;
    };
    IconCustomerRegistationComponent.prototype.ParseArrivalPort = function (name) {
        var str = '';
        this.portList.map(function (res) {
            if (res.ItemName == name) {
                str = res.ItemCode;
            }
        });
        return str;
    };
    IconCustomerRegistationComponent.prototype.ParseDestCountry = function (name) {
        var str = '';
        this.destCountryCodesList.map(function (res) {
            if (res.ItemName == name) {
                str = res.ItemCode;
            }
        });
        return str;
    };
    IconCustomerRegistationComponent.prototype.ParseIntroducerCode = function () {
        var _this = this;
        var str = '';
        this.SalesEmployeeList.map(function (res) {
            if (res.EmailAddress == _this.agentEmail) {
                str = res.EmployeeId;
            }
        });
        return str;
    };
    IconCustomerRegistationComponent.prototype.GetPortList = function () {
        var _this = this;
        this.autoPort = [];
        this.autoCountry = this.ParseDestCountry(this.registerCustomerForm.get('destCountryCode').value);
        this.portList.map(function (x) {
            if (x.CountryId == _this.autoCountry)
                _this.autoPort.push(x);
        });
        if (this.autoPort && !this.autoPort.length) {
            this.otherPorts.map(function (y) {
                if (y.CountryId == _this.autoCountry)
                    _this.autoPort.push(y);
            });
        }
        if (this.autoCountry != '' && this.autoPort && this.autoPort.length) {
            this.registerCustomerForm.get('arrivalPortId').setValue(this.autoPort[0].ItemCode);
        }
    };
    IconCustomerRegistationComponent.prototype.loadMore = function (event) {
        // console.log(event.target);
        // this.SalesEmployeeList = this.SalesEmployeeList.concat(response.agents);
    };
    IconCustomerRegistationComponent.prototype.RegisterCustomer = function () {
        var _this = this;
        var details;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: "Are you sure you want to register this customer?" }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                if (_this.customerId) {
                    details = { customerId: _this.customerId };
                }
                else {
                    details = {
                        tid: _this._selectedThreadId,
                        thread: {
                            customerName: _this.registerCustomerForm.get('customerName').value,
                            firstName: _this.registerCustomerForm.get('firstName').value,
                            lastName: _this.registerCustomerForm.get('lastName').value,
                            destCountryCode: _this.ParseDestCountry(_this.registerCustomerForm.get('destCountryCode').value).toString(),
                            arrivalPortId: _this.registerCustomerForm.get('arrivalPortId').value.toString(),
                            customerTypeId: _this.registerCustomerForm.get('customerTypeId').value,
                            salePersonUserCode: _this.ParseSalesPerson(_this.registerCustomerForm.get('salePersonUserCode').value),
                            contactPhoneTypeId: _this.registerCustomerForm.get('contactPhoneTypeId').value.toString(),
                            contactPhoneNumber: _this.ParsePhoneNumber(_this.registerCustomerForm.get('contactPhoneNumber')),
                            contactMailEmailAddress: _this.ParseEmailAddress(_this.registerCustomerForm.get('contactMailEmailAddress')),
                            homePageOnFlg: _this.registerCustomerForm.get('homePageOnFlg').value,
                            myPageOnFlg: _this.registerCustomerForm.get('myPageOnFlg').value,
                            bulkEmailFlg: _this.registerCustomerForm.get('bulkEmailFlg').value,
                            bulkEmailStockListFlg: _this.registerCustomerForm.get('bulkEmailStockListFlg').value,
                            introducerCode: _this.ParseIntroducerCode(),
                            createUserCode: _this.ParseIntroducerCode(),
                            ContactPhonePerson: _this.registerCustomerForm.get('firstName').value + ' ' + _this.registerCustomerForm.get('lastName').value,
                            ContactMailPerson: _this.registerCustomerForm.get('firstName').value + ' ' + _this.registerCustomerForm.get('lastName').value,
                            WhyNotBuyReasonCode: "1"
                        }
                    };
                }
                // console.log(details);
                _this.registrationData.emit(details);
            }
        });
    };
    __decorate([
        core_1.Input()
    ], IconCustomerRegistationComponent.prototype, "countryName", null);
    __decorate([
        core_1.Input()
    ], IconCustomerRegistationComponent.prototype, "visitorName", null);
    __decorate([
        core_1.Input()
    ], IconCustomerRegistationComponent.prototype, "visitorPhone", null);
    __decorate([
        core_1.Input()
    ], IconCustomerRegistationComponent.prototype, "visitorEmail", null);
    __decorate([
        core_1.Input()
    ], IconCustomerRegistationComponent.prototype, "agentName", null);
    __decorate([
        core_1.Input()
    ], IconCustomerRegistationComponent.prototype, "selectedThreadId", null);
    __decorate([
        core_1.Input('agentEmail')
    ], IconCustomerRegistationComponent.prototype, "agentEmail", void 0);
    __decorate([
        core_1.Input('permissions2')
    ], IconCustomerRegistationComponent.prototype, "permissions", void 0);
    __decorate([
        core_1.Input('CustomerInfo')
    ], IconCustomerRegistationComponent.prototype, "CustomerInfo", void 0);
    __decorate([
        core_1.Input('RelatedCustomerInfo')
    ], IconCustomerRegistationComponent.prototype, "RelatedCustomerInfo", void 0);
    __decorate([
        core_1.Input('loadingReg')
    ], IconCustomerRegistationComponent.prototype, "loadingReg", void 0);
    __decorate([
        core_1.Output('registrationData')
    ], IconCustomerRegistationComponent.prototype, "registrationData", void 0);
    IconCustomerRegistationComponent = __decorate([
        core_1.Component({
            selector: 'app-icon-customer-registation',
            templateUrl: './icon-customer-registation.component.html',
            styleUrls: ['./icon-customer-registation.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], IconCustomerRegistationComponent);
    return IconCustomerRegistationComponent;
}());
exports.IconCustomerRegistationComponent = IconCustomerRegistationComponent;
//# sourceMappingURL=icon-customer-registation.component.js.map