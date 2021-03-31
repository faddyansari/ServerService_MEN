import { Component, OnInit, Input, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { IconIntegrationService } from '../../../services/IconIntegrationService';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material';


@Component({
  selector: 'app-icon-customer-registation',
  templateUrl: './icon-customer-registation.component.html',
  styleUrls: ['./icon-customer-registation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IconCustomerRegistationComponent implements OnInit {
  /** FORMGROUPS */
  public registerCustomerForm: FormGroup;
  /** ALL REGEX HERE */
  _visitorName: any;
  _visitorPhone: any;
  _visitorEmail: any;
  _agentName: any;
  _countryName: any;

  _selectedThreadId: any;
  emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  whiteSpaceRegex = /^[^\s]+(\s+[^\s]+)*$/;
  phoneNumberRegex = /^([+]{1})?\d+$/;
  numbersOnlyRegex = /^[0-9]*$/;
  customerId = ''
  /**INPUTS */


  @Input() set countryName(value) {
    this._countryName = value;
    
    this.registerCustomerForm.get('destCountryCode').setValue(this._countryName);
    if (this.registerCustomerForm.get('destCountryCode').value != '') {
      this._iconService.GetMasterData(2).subscribe(result => {
        if (result) {
          this.portList = result.MasterData;
          this.GetPortList();
        }
      })
    }
  }
  get countryName(): any {
    return this._countryName;
  }
  @Input() set visitorName(value) {
    this._visitorName = value;
    this.registerCustomerForm.get('customerName').setValue(this._visitorName);
    this.registerCustomerForm.get('firstName').setValue(this._visitorName);
  }
  get visitorName(): any {
    return this._visitorName;
  }
  @Input() set visitorPhone(value) {
    this._visitorPhone = value;
    ((this.registerCustomerForm.get('contactPhoneNumber') as FormArray).controls[0] as FormGroup).get('number').setValue(this._visitorPhone);

  }
  get visitorPhone(): any {
    return this._visitorPhone;
  }
  @Input() set visitorEmail(value) {
    this._visitorEmail = value;
    ((this.registerCustomerForm.get('contactMailEmailAddress') as FormArray).controls[0] as FormGroup).get('address').setValue(this._visitorEmail);
  }
  get visitorEmail(): any {
    return this._visitorEmail;
  }
  @Input() set agentName(value) {
    this._agentName = value;
    this.registerCustomerForm.get('salePersonUserCode').setValue(this._agentName);
  }
  get agentName(): any {
    return this._agentName;
  }

  @Input() set selectedThreadId(value) {
    
    this._selectedThreadId = value;
    this.registerCustomerForm.get('customerName').setValue(this._visitorName);
    this.registerCustomerForm.get('firstName').setValue(this._visitorName);
    this.registerCustomerForm.get('destCountryCode').setValue(this._countryName);
    if (this.registerCustomerForm.get('destCountryCode').value != '') {
      this._iconService.GetMasterData(2).subscribe(result => {
        if (result) {
          this.portList = result.MasterData;
          this.GetPortList();
        }
      })
    }
    this.registerCustomerForm.get('lastName').setValue('');
    this.registerCustomerForm.get('customerTypeId').setValue('');
    this.registerCustomerForm.get('contactPhoneTypeId').setValue('');
    this.registerCustomerForm.get('homePageOnFlg').setValue('1');
    this.registerCustomerForm.get('myPageOnFlg').setValue('1');
    this.registerCustomerForm.get('bulkEmailFlg').setValue('1');
    this.registerCustomerForm.get('bulkEmailStockListFlg').setValue('1');
    this.registerCustomerForm.get('salePersonUserCode').setValue(this._agentName);
    ((this.registerCustomerForm.get('contactPhoneNumber') as FormArray).controls[0] as FormGroup).get('number').setValue(this._visitorPhone);
    ((this.registerCustomerForm.get('contactMailEmailAddress') as FormArray).controls[0] as FormGroup).get('address').setValue(this._visitorEmail);

  }
  get selectedThreadId(): any {
    return this._selectedThreadId;
  }

  @Input('agentEmail') agentEmail = '';
  @Input('permissions2') permissions: any;
  @Input('CustomerInfo') CustomerInfo = undefined;
  @Input('RelatedCustomerInfo') RelatedCustomerInfo = undefined;
  @Input('loadingReg') loadingReg = false;
  /**OUTPUTS */
  @Output('registrationData') registrationData = new EventEmitter();
  /** ALL BOOLEANS HERE */
  addNewNumber = false;
  addNewEmail = false;
  checkBoxPhone = false;
  checkBoxEmail = false;

  pill1 = true;
  pill2 = false;

  /**MISC */
  agent = undefined;
  /** ALL ARRAYS OF MASTER DATA */
  destCountryCodesList = [];
  portList = [];
  customerTypeList = [];
  phoneIDList = [];
  SalesEmployeeList = [];
  autoPort = [];
  autoCountry: any;

  otherPorts = [
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
  ]
  constructor(private formbuilder: FormBuilder,
    public dialog: MatDialog,
    private _iconService: IconIntegrationService) {
    this._iconService.GetMasterData(1).subscribe(result => {
      if (result) {
        this.destCountryCodesList = result.MasterData
      }
    })
    this._iconService.GetMasterData(2).subscribe(result => {
      if (result) {
        this.portList = result.MasterData;
      }
    })
    this._iconService.GetMasterData(3).subscribe(result => {
      if (result) {
        this.customerTypeList = result.MasterData;
      }
    })
    this._iconService.GetMasterData(4).subscribe(result => {
      if (result) {
        this.phoneIDList = result.MasterData
      }
    })
    this._iconService.GetMasterData(19).subscribe(result => {
      if (result) {
        this.SalesEmployeeList = result.MasterData;
      }
    });
    this.registerCustomerForm = this.formbuilder.group({
      'customerName': ['', [Validators.required, Validators.maxLength(100), Validators.pattern(this.whiteSpaceRegex)]],
      'firstName': ['', [Validators.maxLength(100), Validators.pattern(this.whiteSpaceRegex)]],
      'lastName': ['', [Validators.maxLength(100), Validators.pattern(this.whiteSpaceRegex)]],
      'destCountryCode': ['', [Validators.required]],
      'arrivalPortId': ['', [Validators.required]],
      'customerTypeId': ['', [Validators.required]],
      'salePersonUserCode': ['', [Validators.required]],
      'contactPhoneTypeId': ['', [Validators.required]],
      'contactPhoneNumber': this.formbuilder.array(this.TransformPhoneNumber('')),
      'contactMailEmailAddress': this.formbuilder.array(this.TransformEmailAddress('')),
      'homePageOnFlg': ['1', [Validators.required]],
      'myPageOnFlg': ['1', [Validators.required]],
      'bulkEmailFlg': ['1', [Validators.required]],
      'bulkEmailStockListFlg': ['1', [Validators.required]]

    });
  }


  ngOnInit() {
    if (this.permissions.canRegisterIconCustomer) this.pill1 = true;
    else if (this.permissions.canSeeRegisteredIconCustomer) this.pill1 = true;
    else this.pill2 = true;

  }

  TransformPhoneNumber(visitorPhone): FormGroup[] {
    let fb: FormGroup[] = [];
    fb.push(this.formbuilder.group({
      number: [visitorPhone,
        [Validators.pattern(this.phoneNumberRegex),
        Validators.required]],
      isDefaultPN: [false, []]
    }));

    return fb;
  }

  GetControls(name: string) {
    return (this.registerCustomerForm.get(name) as FormArray).controls;
  }
  ParseEmailAddress(formArray) {
    let arr = [];
    formArray.controls.map(control => {
      if (control.get('isDefault').value) {
        arr.unshift(control.get('address').value);
      }
      else {
        arr.push(control.get('address').value);
      }
    });
    let str = arr.join(';');
    return str;
  }
  ParsePhoneNumber(formArray) {
    let arr = [];
    formArray.controls.map(control => {

      if (control.get('isDefaultPN').value) {
        arr.unshift(control.get('number').value);
      }
      else {
        arr.push(control.get('number').value);
      }
    });
    let str = arr.join(';');
    return str;
  }
  AddPhoneNumber() {
    this.addNewNumber = true;
    let fb: FormGroup = this.formbuilder.group({
      number: ['', [Validators.pattern(this.phoneNumberRegex),
      Validators.required]],
      isDefaultPN: [false]
    })
    let phNumber = this.registerCustomerForm.get('contactPhoneNumber') as FormArray;
    phNumber.push(fb);

  }
  DeletePhoneNumber(index) {
    let number = this.registerCustomerForm.get('contactPhoneNumber') as FormArray;
    number.removeAt(index);
  }

  TransformEmailAddress(value) {
    let fb: FormGroup[] = [];
    fb.push(this.formbuilder.group({
      address: [value,
        [Validators.pattern(this.emailPattern),
        Validators.required]],
      isDefault: [false, []]
    }));
    return fb;

  }
  AddEmailAddress() {
    this.addNewEmail = true;
    let fb: FormGroup = this.formbuilder.group({
      address: ['', [Validators.pattern(this.emailPattern),
      Validators.required]],
      isDefault: [false]
    })
    let phNumber = this.registerCustomerForm.get('contactMailEmailAddress') as FormArray;
    phNumber.push(fb);
  }
  DeleteEmailAddress(index) {
    let number = this.registerCustomerForm.get('contactMailEmailAddress') as FormArray;
    number.removeAt(index);
  }
  OnChange(event, index) {
    this.checkBoxPhone = true;
    (<FormGroup>(<FormArray>this.registerCustomerForm.controls['contactPhoneNumber']).controls[index]).controls['isDefaultPN'].setValue(event.target.checked);

  }
  OnChangeEmail(event, index) {
    this.checkBoxEmail = true;

    (<FormGroup>(<FormArray>this.registerCustomerForm.controls['contactMailEmailAddress']).controls[index]).controls['isDefault'].setValue(event.target.checked);

  }
  CheckDefaultEmail() {
    if (
      (((this.registerCustomerForm.get('contactMailEmailAddress') as FormArray).controls.length > 1)
        && ((this.registerCustomerForm.get('contactMailEmailAddress') as FormArray).value.every(val => !val.isDefault)))
    ) {
      return true;
    }
    else return false;
  }
  CheckCustomerId() {
    if (this.customerId) {
      return true
    }
    else {
      return false
    }
  }
  ValidateCustomerId() {
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
  }


  CheckDefaultPhone() {
    if (
      (((this.registerCustomerForm.get('contactPhoneNumber') as FormArray).controls.length > 1)
        && ((this.registerCustomerForm.get('contactPhoneNumber') as FormArray).value.every(val => !val.isDefaultPN)))
    ) {
      return true;
    }
    else return false;
  }

  setPillActive(pill) {
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
  }

  ParseSalesPerson(name) {
    let str = '';
    this.SalesEmployeeList.map(res => {
      if (res.EmployeeName == name) {
        str = res.EmployeeId;
      }
    })
    return str;
  }

  ParseArrivalPort(name) {

    let str = '';
    this.portList.map(res => {
      if (res.ItemName == name) {
        str = res.ItemCode;
      }
    })
    return str;
  }
  ParseDestCountry(name) {
    let str = '';
    this.destCountryCodesList.map(res => {
      if (res.ItemName == name) {
        str = res.ItemCode;

      }
    })

    return str;
  }

  ParseIntroducerCode() {
    let str = '';
    this.SalesEmployeeList.map(res => {
      if (res.EmailAddress == this.agentEmail) {
        str = res.EmployeeId;
      }
    })
    return str;
  }
  GetPortList() {
    this.autoPort = []
    this.autoCountry = this.ParseDestCountry(this.registerCustomerForm.get('destCountryCode').value);

    this.portList.map(x => {
      if (x.CountryId == this.autoCountry) this.autoPort.push(x);
    })
    if (this.autoPort && !this.autoPort.length) {

      this.otherPorts.map(y => {
        if (y.CountryId == this.autoCountry) this.autoPort.push(y);
      })
    }
    if (this.autoCountry != '' && this.autoPort && this.autoPort.length) {
      this.registerCustomerForm.get('arrivalPortId').setValue(this.autoPort[0].ItemCode);
    }
  }

  loadMore(event) {
    // console.log(event.target);
    // this.SalesEmployeeList = this.SalesEmployeeList.concat(response.agents);
  }
  RegisterCustomer() {
    let details: any;
    this.dialog.open(ConfirmationDialogComponent, {
      panelClass: ['confirmation-dialog'],
      data: { headermsg: "Are you sure you want to register this customer?" }
    }).afterClosed().subscribe(data => {
      if (data == 'ok') {

        if (this.customerId) {
          details = { customerId: this.customerId }
        }
        else {
          details = {
            tid: this._selectedThreadId,
            thread: {
              customerName: this.registerCustomerForm.get('customerName').value,
              firstName: this.registerCustomerForm.get('firstName').value,
              lastName: this.registerCustomerForm.get('lastName').value,
              destCountryCode: this.ParseDestCountry(this.registerCustomerForm.get('destCountryCode').value).toString(),
              arrivalPortId: this.registerCustomerForm.get('arrivalPortId').value.toString(),
              customerTypeId: this.registerCustomerForm.get('customerTypeId').value,
              salePersonUserCode: this.ParseSalesPerson(this.registerCustomerForm.get('salePersonUserCode').value),
              contactPhoneTypeId: this.registerCustomerForm.get('contactPhoneTypeId').value.toString(),
              contactPhoneNumber: this.ParsePhoneNumber(this.registerCustomerForm.get('contactPhoneNumber')),
              contactMailEmailAddress: this.ParseEmailAddress(this.registerCustomerForm.get('contactMailEmailAddress')),
              homePageOnFlg: this.registerCustomerForm.get('homePageOnFlg').value,
              myPageOnFlg: this.registerCustomerForm.get('myPageOnFlg').value,
              bulkEmailFlg: this.registerCustomerForm.get('bulkEmailFlg').value,
              bulkEmailStockListFlg: this.registerCustomerForm.get('bulkEmailStockListFlg').value,
              introducerCode: this.ParseIntroducerCode(),
              createUserCode: this.ParseIntroducerCode(),
              ContactPhonePerson: this.registerCustomerForm.get('firstName').value + ' ' + this.registerCustomerForm.get('lastName').value,
              ContactMailPerson: this.registerCustomerForm.get('firstName').value + ' ' + this.registerCustomerForm.get('lastName').value,
              WhyNotBuyReasonCode: "1"
            }
          }
        }
        // console.log(details);
        this.registrationData.emit(details);

      }
    });

  }
}

