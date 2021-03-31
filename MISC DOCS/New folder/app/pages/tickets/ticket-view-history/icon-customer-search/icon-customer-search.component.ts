import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-icon-customer-search',
  templateUrl: './icon-customer-search.component.html',
  styleUrls: ['./icon-customer-search.component.scss']
})
export class IconCustomerSearchComponent implements OnInit {
  public searchCustomerForm: FormGroup;
  emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  whiteSpaceRegex = /^[^\s]+(\s+[^\s]+)*$/;
  phoneNumberRegex = /^([+]{1})?\d+$/;
  numbersOnly = /^[0-9]*$/;
  /**INPUTS AND OUTPUTS */
  @Input('loadingIconSearch') loadingIconSearch = false;
  _searchedData: any;
  @Input() set searchedData(value) {
    this._searchedData = value;
  }
  get searchedData(): any {
    return this._searchedData;
  }
  @Output('searchData') searchData = new EventEmitter();
  _selectedThread: any;
  @Input() set selectedThread(value) {
    this._selectedThread = value;
    this.searchCustomerForm.get('customerId').setValue('');
    this.searchCustomerForm.get('emailAddress').setValue('');
    this.searchCustomerForm.get('phoneNumber').setValue('');
    this.searchedData = [];
    this._searchedData = [];

  };
  get selectedThread(): any {
    return this._selectedThread;
  }
  constructor(private formbuilder: FormBuilder) {
    this.searchCustomerForm = this.formbuilder.group({
      'customerId': ['', [Validators.pattern(this.whiteSpaceRegex),Validators.pattern(this.numbersOnly) ]],
      'emailAddress': ['', [Validators.pattern(this.emailPattern)]],
      'phoneNumber': ['', [Validators.pattern(this.phoneNumberRegex), Validators.maxLength(15)]]
    });

  }

  ngOnInit() {

  }

  SubmitForm() {
    this.searchData.emit(this.searchCustomerForm.value);
  }

  typeof(value) {
    return typeof value;
  }
  CheckValue() {
    if (!this.searchCustomerForm.get('customerId').value && !this.searchCustomerForm.get('emailAddress').value && !this.searchCustomerForm.get('phoneNumber').value) {
      return true;
    }
    else return false;
  }
  ngOnDestroy() {
  }

  ResetForm(){
    this.searchCustomerForm.get('customerId').setValue('');
    this.searchCustomerForm.get('emailAddress').setValue('');
    this.searchCustomerForm.get('phoneNumber').setValue('');
    this.searchedData = [];
    this._searchedData = [];
  }
}
