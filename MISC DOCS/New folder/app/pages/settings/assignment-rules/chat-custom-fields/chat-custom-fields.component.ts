import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChatCustomFieldServiceService } from '../../../../../services/LocalServices/ChatCustomfieldService.service'
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastNotifications } from '../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import { AuthService } from '../../../../../services/AuthenticationService';
import { UtilityService } from '../../../../../services/UtilityServices/UtilityService';
import { TicketAutomationService } from '../../../../../services/LocalServices/TicketAutomationService';

@Component({
  selector: 'app-chat-custom-fields',
  templateUrl: './chat-custom-fields.component.html',
  styleUrls: ['./chat-custom-fields.component.css'],
  providers : [ChatCustomFieldServiceService],
  encapsulation : ViewEncapsulation.None,
})
export class ChatCustomFieldsComponent implements OnInit {
	whiteSpaceRegex = /^[^\s]+(\s+[^\s]+)*$/;
	subscriptions: Array<Subscription> = [];
	customFields: Array<any> = [];
	saving = false;
	// selectedField: any = {
	//   index: -1,
	//   field: undefined
	// }
	public CustomFormFields: FormGroup
	public selectedField: FormGroup
	public selectedIndex = -1;

	groupList = [];
	selectedGroups = [];
	package : any;

	DropdownSettings = {
		singleSelection: false,
		enableCheckAll: true,
		itemsShowLimit: 5,
		selectAllText: 'Select All',
		unSelectAllText: 'UnSelect All',
		allowSearchFilter: true
	};

	constructor(private _customFieldService: ChatCustomFieldServiceService,
		public formbuilder: FormBuilder,
		private _appStateService: GlobalStateService,
		private _authService: AuthService,
		private _ticketAutomationSvc:TicketAutomationService,
		public snackBar: MatSnackBar) {

		this._appStateService.contentInfo.next('');
		this._appStateService.breadCrumbTitle.next('Chat Settings');
		this.subscriptions.push(_authService.getPackageInfo().subscribe(pkg => {
			if (pkg) {
				this.package = pkg;
				
			}
			// console.log(agent);
		}));
		this._customFieldService.CustomFields.subscribe(customFields => {

			//if (customFields && customFields.length) {
				this.customFields = customFields;
				//console.log('Custom Fields', this.customFields);
				this.CustomFormFields = this.formbuilder.group({
          fields: this.formbuilder.array((this.customFields && this.customFields.length) ? this.TransformFields(this.customFields) : [])
          
				});
			//}
		});
		this.subscriptions.push(this._authService.getSettings().subscribe(data => {
			if (data && data.permissions) {
			}
		}));

		this.subscriptions.push(this._ticketAutomationSvc.Groups.subscribe(data => {
			if (data) {
				this.groupList = data.map(g => g.group_name);
			}

		}));

	}

	ngOnInit() {
	}

	ngOnDestroy(): void {
		//Called once, before the instance is destroyed.
		//Add 'implements OnDestroy' to the class.
		this.subscriptions.map(subscription => {
			subscription.unsubscribe();
		});
		this._customFieldService.Destroy();
	}

	TransformFields(fields?: Array<any>): FormGroup[] {
		let fb: FormGroup[] = [];
		fields.map(field => {
			fb.push(this.formbuilder.group({
				label: [field.label, [Validators.required,Validators.pattern(this.whiteSpaceRegex)]],
				name: [field.name, [Validators.required,Validators.pattern(this.whiteSpaceRegex)]],
				type: [field.type, Validators.required],
				isCollection: [field.isCollection, Validators.required],
				required: [field.required, Validators.required],
				default: [field.default, Validators.required],
				elementType: [field.elementType, Validators.required],
				options: [field.options],
				visibilityCriteria: [(field.visibilityCriteria) ? field.visibilityCriteria : 'all', Validators.required],
				groupList: [(field.groupList) ? field.groupList : []]
			}));
		});

		return fb;
	}

	TransformOptions(options?: Array<any>): FormGroup[] {
		//console.log(options);

		let fb: FormGroup[] = [];
		options.map(option => {
			fb.push(this.formbuilder.group({
				name: [option.name, [Validators.required]],
				value: [option.value, [Validators.required]],
			}));
		})

		return fb;
	}

	public GetFields() {
    // console.log('getting fields');
    
		return (this.CustomFormFields.get('fields') as FormArray).controls;
	}

	drag(event) {
		// event.preventDefault();
		// event.stopPropagation();
		// event.stopImmediatePropagation();
		// event.dataTransfer.setData("text", event.target.id);
		// console.log('Drage Start', event);
		event.dataTransfer.setData("text", event.target.id);

		//console.log('Drag Start', event.dataTransfer.getData("text"))

	}

	drop(event) {
		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation();
		//console.log('Drop', event.dataTransfer.getData("text"));
		this.isDragged = false;
		// let el = document.getElementById(event.dataTransfer.getData("text"));
		// if (el) {
		//   el.draggable = false;
		// }
		this.AddField(event.dataTransfer.getData("text"))

		// var data = ev.dataTransfer.getData("text");
		// ev.target.appendChild(document.getElementById(data));
	}

	CheckIfOptionAdded(){
		if(this.selectedField.get('elementType').value == 'dropdown' && !((this.selectedField.get('options') as FormArray).value.length)){
			return true
		}
		else return false
	}

	AddField(value: string) {
		let fb: FormGroup;
		console.log(value);

		switch (value.trim()) {
			case "checkbox":
				fb = this.formbuilder.group({
					label: ['Checkbox', [Validators.required,Validators.pattern(this.whiteSpaceRegex)]],
					name: [null, [Validators.required,Validators.pattern(this.whiteSpaceRegex)]],
					type: ['boolean'],
					isCollection: [false],
					required: [false, Validators.required],
					default: [false, Validators.required],
					elementType: ['checkbox', Validators.required],
					options: [[]],
					visibilityCriteria: ['all', Validators.required],
					groupList: [[]]
				})
				break;
			case "radio":
				fb = this.formbuilder.group({
					label: ['Radio Button', [Validators.required,Validators.pattern(this.whiteSpaceRegex)]],
					name: [null, [Validators.required,Validators.pattern(this.whiteSpaceRegex)]],
					type: ['boolean'],
					isCollection: [false, Validators.required],
					required: [false, Validators.required],
					default: [false, Validators.required],
					elementType: ['radio', Validators.required],
					options: [[]],
					visibilityCriteria: ['all', Validators.required],
					groupList: [[]]
				})
				break;
			case "date":
				fb = this.formbuilder.group({
					label: ['Datebox', [Validators.required,Validators.pattern(this.whiteSpaceRegex)]],
					name: [null, [Validators.required,Validators.pattern(this.whiteSpaceRegex)]],
					type: ['string'],
					isCollection: [false],
					required: [false, Validators.required],
					default: [false, Validators.required],
					elementType: ['date', Validators.required],
					options: [[]],
					visibilityCriteria: ['all', Validators.required],
					groupList: [[]]
				})
				break;
			case "textbox":
				fb = this.formbuilder.group({
					label: ['Textbox', [Validators.required,Validators.pattern(this.whiteSpaceRegex)]],
					name: [null, [Validators.required,Validators.pattern(this.whiteSpaceRegex)]],
					type: ['string'],
					isCollection: [false],
					required: [false, Validators.required],
					default: [false, Validators.required],
					elementType: ['textbox', Validators.required],
					options: [[]],
					visibilityCriteria: ['all', Validators.required],
					groupList: [[]]
				})
				break;
			case "dropdown":
				fb = this.formbuilder.group({
					label: ['Select Option', [Validators.required,Validators.pattern(this.whiteSpaceRegex)]],
					name: [null, [Validators.required,Validators.pattern(this.whiteSpaceRegex)]],
					type: ['string'],
					isCollection: [false],
					required: [false, Validators.required],
					default: [false, Validators.required],
					elementType: ['dropdown', Validators.required],
					options: [[]],
					visibilityCriteria: ['all', Validators.required],
					groupList: [[]]
				})
				break;
		}

		let fields = this.CustomFormFields.get('fields') as FormArray;
		fields.push(fb);

	}

	SetEdit(i) {

		let fields = this.CustomFormFields.get('fields') as FormArray;
		fields.controls[i].value;
		this.selectedIndex = i;
		//console.log('Set Edit', fields.controls[i].value.options)
		this.selectedGroups = (fields.controls[i].value.groupList) ? fields.controls[i].value.groupList : [];

		this.selectedField = this.formbuilder.group({
			label: [fields.controls[i].value.label, [Validators.required,Validators.pattern(this.whiteSpaceRegex)]],
			name: [fields.controls[i].value.name, [Validators.required,Validators.pattern(this.whiteSpaceRegex)]],
			type: [fields.controls[i].value.type],
			isCollection: [fields.controls[i].value.isCollection],
			required: [fields.controls[i].value.required, Validators.required],
			default: [false, Validators.required],
			elementType: [fields.controls[i].value.elementType, Validators.required],
			options: this.formbuilder.array(this.TransformOptions(fields.controls[i].value.options)),
			visibilityCriteria: [(fields.controls[i].value.visibilityCriteria) ? fields.controls[i].value.visibilityCriteria : 'all', Validators.required],
			groupList: [(fields.controls[i].value.groupList) ? fields.controls[i].value.groupList : []]
		})
	}

	moveUp(index: number) {

		if (((this.CustomFormFields.controls['fields'] as FormArray).controls[index - 1] as FormGroup).controls['default'].value) {
			this.snackBar.openFromComponent(ToastNotifications, {
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
			this.swap((this.CustomFormFields.get('fields') as FormArray).controls, index, index - 1)
		}
		else {
			this.snackBar.openFromComponent(ToastNotifications, {
				data: {
					msg: 'No fields above, Not allowed!',
					img: 'warning'
				},
				duration: 2000,
				panelClass: ['user-alert', 'warning']
			});
		}
	}

	moveDown(index: number) {

		if (index < (this.CustomFormFields.get('fields') as FormArray).length - 1) {
			this.swap((this.CustomFormFields.get('fields') as FormArray).controls, index, index + 1)
		}
		else {
			this.snackBar.openFromComponent(ToastNotifications, {
				data: {
					msg: 'No fields below, Not allowed!',
					img: 'warning'
				},
				duration: 2000,
				panelClass: ['user-alert', 'warning']
			});
		}
	}

	swap(array: any[], index1: any, index2: any) {
		let temp = array[index1];
		array[index1] = array[index2];
		array[index2] = temp;
	}

	SaveField() {


		let fields = this.CustomFormFields.get('fields') as FormArray;
		let obj = this.selectedField.value;
		obj.groupList = this.selectedGroups;
		fields.at(this.selectedIndex).patchValue(obj);
		//fields.at(this.selectedIndex).get('options').patchValue(this.formbuilder.array(this.TransformOptions(this.selectedField.get('options').value)));
		// console.log('selectedField Value : ', this.selectedField.value);
		// console.log('Fields : ', fields)
		this.selectedField = undefined;
	}

	DeleteField(i) {
		let fields = this.CustomFormFields.get('fields') as FormArray;
		fields.removeAt(i);
		this.selectedField = undefined;
		this.selectedIndex = -1;

	}

	isDragged = false;
	allowDrop(event) {
		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation();
		this.isDragged = true;

	}

	DragLeave(event) {
		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation();
		this.isDragged = false;
		//console.log('Drag End');
	}


	AddOption() {
		let fb = this.formbuilder.group({
			name: ['', [Validators.required,Validators.pattern(this.whiteSpaceRegex)]],
			value: ['', [Validators.required,Validators.pattern(this.whiteSpaceRegex)]],
		});
		let options = this.selectedField.get('options') as FormArray;

		options.push(fb);
	}
	GetOptionsDisplay(field: FormGroup) {
		let fa = field.get('options') as FormArray;
		//console.log(field);
		return fa.controls;

	}

	DeleteOption(i) {
		let fa = this.selectedField.get('options') as FormArray;
		fa.removeAt(i);
	}

	public GetOptions() {
		return (this.selectedField.get('options') as FormArray).controls;
	}

	Clear() {
		this.selectedField = undefined;
		this.selectedIndex = -1;
	}

	SubmitForm() {
		// console.log(this.selectedField);

		this.saving = true;
		this._customFieldService.UpdateFields({ 'fields': this.ParseFields(this.CustomFormFields.get('fields') as FormArray) }).subscribe(res => {
      console.log(this.CustomFormFields);
      
      this.saving = false;
			if (res.status == 'ok') {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'ok',
						msg: 'Fields Updated successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				});
			}
		},
			err => {
				this.saving = false;
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'warning',
						msg: 'Unable to Update Field!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'error']
				});

			})

	}
	ParseFields(fields) {
		let field = [];

		fields.controls.map(control => {
			let obj = {
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
			}

			field.push(obj);
		})

		return field;

	}
}

