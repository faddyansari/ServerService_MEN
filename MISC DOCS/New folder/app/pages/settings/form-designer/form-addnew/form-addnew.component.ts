import { Component, OnInit, Input, ViewEncapsulation, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription'
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { FormDesignerService } from '../../../../../services/LocalServices/FormDesignerService';
import { ConfirmationDialogComponent } from '../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { ToastNotifications } from '../../../../dialogs/SnackBar-Dialog/toast-notifications.component'
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PreviewFormComponent } from '../../../../dialogs/preview-form/preview-form.component';
import { AuthService } from '../../../../../services/AuthenticationService';
import { GlobalStateService } from '../../../../../services/GlobalStateService';

@Component({
	selector: 'app-form-addnew',
	templateUrl: './form-addnew.component.html',
	styleUrls: ['./form-addnew.component.scss'],
	encapsulation: ViewEncapsulation.None,
})

export class FormAddnewComponent implements OnInit {
	@Input() FormObject: any;
	@ViewChild('previewDiv') preivewDiv: ElementRef;
	//for checkbox and input field formGroupName
	i = 0;
	formChanges: any;
	//Flags
	input = false;
	dropdown = false;
	radio = false;
	checkbox = false;
	isDragged = false;
	editCase = false;
	enableEdit = false;

	public createForm: FormGroup;
	//For getting reference of selected element.
	currentElement: any;
	AllForms = [];
	inputFields: any = [];
	arr: FormArray;
	nsp: string = '';
	email: string = '';
	subscriptions: Subscription[] = [];
	Fields = [];
	SelectedForm = undefined;
	//Regex
	urlRegex: RegExp = /((http(s)?:\/\/)?([\w-]+\.)+[\w-]+[.com]+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?)/gmi;
	SpecialChar = /^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/;
	whiteSpace = /^[^-\s][a-zA-Z0-9_\s-]+$/;
	//Action Forms
	formActions = [];
	package: any;

	constructor(private _authService: AuthService, private _appStateService: GlobalStateService, public formbuilder: FormBuilder, private formDesignerService: FormDesignerService, private dialog: MatDialog, private fb: FormBuilder, public snackBar: MatSnackBar) {

		this.subscriptions.push(_authService.getPackageInfo().subscribe(pkg => {

			if (pkg) {
				this.package = pkg.tickets.formDesigner;
				if (!this.package.allowed) {
					this._appStateService.NavigateTo('/noaccess');
				}
			}

		}));
		//All forms
		this.subscriptions.push(this.formDesignerService.WholeForm.subscribe(response => {
			if (response && response.length) this.AllForms = response;
		}));

		//For edit case
		this.subscriptions.push(this.formDesignerService.selectedForm.subscribe(value => {

			if (value) {
				this.editCase = true;
				this.SelectedForm = value;
				this.inputFields = this.SelectedForm.formFields;
			}

		}));

		// this.subscriptions.push(this.formDesignerService.Actions.subscribe(actions => {
		//   this.formActions = actions;
		// }));

		this.nsp = this.formDesignerService.Agent.nsp;
		this.email = this.formDesignerService.Agent.email;

	}

	ngOnInit() {

		this.createForm = this.formbuilder.group({
			'formName':
				[this.FormObject.formName,
				[Validators.maxLength(50),
				Validators.pattern(this.SpecialChar),
				Validators.pattern(this.whiteSpace),
				Validators.minLength(2),
				Validators.required],
				],
			'formHeader':
				[this.FormObject.formHeader,
				[Validators.maxLength(50),
				Validators.minLength(2),
				Validators.required
				]
				],
			'formFooter':
				[this.FormObject.formFooter,
				[Validators.maxLength(50),
				Validators.minLength(2),
				Validators.required
				]
				],

			'actionType':
				[this.FormObject.actionType,
				[
				]
				],

			'actionUrl':
				[this.FormObject.actionUrl,
				[
					Validators.pattern(this.urlRegex)
				]
				],

			'formHtml':
				[this.FormObject.formHTML,
				[]
				],
			'conditions': this.formbuilder.array(this.TransformConditions(this.FormObject.formFields), Validators.required)

		});
		this.onChanges();
	}

	//NEW MAIN FUNCTIONS
	drag(event) {
		if ((event.target as HTMLElement).id) {
			event.dataTransfer.setData("text", event.target.id);
		}
		else if (!event.target.id && event.target.tagName.toLowerCase() == 'img') {
			event.dataTransfer.setData("text", event.target.parentNode.id);
		}
		else if (!event.target.id && event.target.tagName.toLowerCase() == 'b') {
			event.dataTransfer.setData("text", event.target.parentNode.id);
		}
	}

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
	}

	drop(event) {
		event.preventDefault();
		this.isDragged = false;
		let id = event.dataTransfer.getData("text");
		let el = document.getElementById(id);
		let node = (el.cloneNode(true) as HTMLElement);
		this.Ondrop(node);
	}

	Ondrop(readElement) {
		if (!(this.inputFields.filter(check => check.id && check.id == readElement.id).length > 0)) {
			readElement.id = 'input-' + Math.random() + '_' + readElement.id;
			let input: any = {
				id: readElement.id,
				type: readElement.id.split('_')[1]
			}
			this.inputFields.push(input);
		}
	}

	DeleteField(_id) {
		this.dialog.open(ConfirmationDialogComponent, {
			panelClass: ['confirmation-dialog'],
			data: { headermsg: "Are you sure want to delete this field?" }
		}).afterClosed().subscribe(data => {
			if (data == 'ok') {
				console.log(_id);

				let ind = this.inputFields.findIndex(a => a.id == _id);
				this.inputFields.splice(ind, 1);
				this.enableEdit = false;
			}
		});
	}

	EditAreaForm(event, element) {
		event.preventDefault();
		event.stopPropagation();
		this.currentElement = document.getElementById(element.id)
		this.enableEdit = true;
		let id = element.id;

		let type = id.split('_')[1];

		switch (type) {
			case 'input':
				this.input = true; this.checkbox = false; this.dropdown = false; this.radio = false;
				break;
			case 'dropdown':
				this.dropdown = true; this.radio = false; this.input = false; this.checkbox = false;
				break;
			case 'radio':
				this.radio = true; this.dropdown = false; this.input = false; this.checkbox = false;
				break;
			case 'checkbox':
				this.checkbox = true; this.input = false; this.dropdown = false; this.radio = false;
				break;
		}

		this.CheckInList(element);
	}

	onChanges() {

		this.createForm.valueChanges.subscribe(val => {
			this.formChanges = val;
		});
		this.createForm.get('conditions').valueChanges.subscribe(val => {
			this.MapToDOM(this.currentElement, val[0].label);
		});
	}

	MapToDOM(el, value) {
		if (el) {
			(el as HTMLElement).children[0].firstElementChild.innerHTML = value;
		}
	}

	SaveEditAreaForm() {
		// if (this.Fields.some(el => el.id == (this.currentElement.id))) {
		//   console.log("element exists");
		//   let index = this.Fields.findIndex(ind => ind.id == this.currentElement.id);
		//   this.Fields[index] = this.ParseFormInput(this.createForm.get('conditions') as FormArray);
		// }
		// else {
		//   console.log("new element");
		//   this.Fields = this.Fields.concat(this.ParseFormInput(this.createForm.get('conditions') as FormArray));
		// }

		this.MaptoList(this.currentElement);
		this.enableEdit = false;
		// console.log(this.Fields);
	}

	EditCaseSave() {
		this.MaptoList(this.currentElement);
		this.enableEdit = false;
	}

	CheckInList(element) {
		this.inputFields.some(input => {
			if (input['id'] == element.id) {
				if (input["placeholder"]) (<FormGroup>(<FormArray>this.createForm.controls['conditions']).controls[0]).controls['placeholder'].setValue(input["placeholder"] ? input["placeholder"] : '');
				if (input["value"]) (<FormGroup>(<FormArray>this.createForm.controls['conditions']).controls[0]).controls['value'].setValue((input["value"]) ? input["value"] : '');
				if (input["fieldName"]) (<FormGroup>(<FormArray>this.createForm.controls['conditions']).controls[0]).controls['fieldName'].setValue((input["fieldName"]) ? input["fieldName"] : '');
				if (input["type"]) (<FormGroup>(<FormArray>this.createForm.controls['conditions']).controls[0]).controls['type'].setValue((input["type"]) ? input["type"] : '');
				if (input["label"]) (<FormGroup>(<FormArray>this.createForm.controls['conditions']).controls[0]).controls['label'].setValue((input["label"]) ? input["label"] : '');
				(<FormGroup>(<FormArray>this.createForm.controls['conditions']).controls[0]).controls['validation'].setValue((input["validation"]) ? input["validation"] : false);
				if (input["options"]) {
					(<FormArray>(<FormGroup>(<FormArray>this.createForm.controls['conditions']).controls[0]).controls['options']) = this.formbuilder.array([]);
					const control = (<FormArray>(<FormGroup>(<FormArray>this.createForm.controls['conditions']).controls[0]).controls['options']);
					input["options"].forEach(x => {
						control.push(this.patchValues(x.key, x.value))
					});
				}
				return true;
			}
			else {
				(<FormGroup>(<FormArray>this.createForm.controls['conditions']).controls[0]).controls['placeholder'].setValue('');
				(<FormGroup>(<FormArray>this.createForm.controls['conditions']).controls[0]).controls['value'].setValue('');
				(<FormGroup>(<FormArray>this.createForm.controls['conditions']).controls[0]).controls['fieldName'].setValue('');
				(<FormGroup>(<FormArray>this.createForm.controls['conditions']).controls[0]).controls['type'].setValue('');
				(<FormGroup>(<FormArray>this.createForm.controls['conditions']).controls[0]).controls['label'].setValue('');
				(<FormGroup>(<FormArray>this.createForm.controls['conditions']).controls[0]).controls['validation'].setValue(false);
				(<FormArray>(<FormGroup>(<FormArray>this.createForm.controls['conditions']).controls[0]).controls['options']) = this.formbuilder.array([]);
				return false;
			}
		});
	}

	MaptoList(el) {
		this.inputFields.map((input) => {
			if (input['id'] == el.id) {
				if (!(<FormGroup>(<FormArray>this.createForm.controls['conditions']).controls[0]).controls['type'].value) {
					input['type'] = input['id'].split('_')[1];
				}
				else {
					input["type"] = (<FormGroup>(<FormArray>this.createForm.controls['conditions']).controls[0]).controls['type'].value;
				}
				input["placeholder"] = (<FormGroup>(<FormArray>this.createForm.controls['conditions']).controls[0]).controls['placeholder'].value;
				input["fieldName"] = (<FormGroup>(<FormArray>this.createForm.controls['conditions']).controls[0]).controls['fieldName'].value;
				input["label"] = (<FormGroup>(<FormArray>this.createForm.controls['conditions']).controls[0]).controls['label'].value;
				input["validation"] = (<FormGroup>(<FormArray>this.createForm.controls['conditions']).controls[0]).controls['validation'].value;
				input["value"] = (<FormGroup>(<FormArray>this.createForm.controls['conditions']).controls[0]).controls['value'].value;
				input["options"] = (<FormArray>(<FormGroup>(<FormArray>this.createForm.controls['conditions']).controls[0]).controls['options']).value;
			}
			//map ends
		});

	}

	CancelEditAreaForm() {
		this.enableEdit = false;
	}

	SaveForm() {
		// let actionurl;
		// this.formActions.map(action => {
		//   if (action.actionType == this.createForm.get('actionType').value) {
		//     actionurl = action.actionUrl;
		//   }
		// })

		// console.log(this.inputFields);

		if (this.AllForms && this.AllForms.filter(data => data.formName.toLowerCase().trim() == this.createForm.get('formName').value.toLowerCase().trim()).length > 0) {
			this.snackBar.openFromComponent(ToastNotifications, {
				data: {
					img: 'warning',
					msg: 'Form Name already exists!'
				},
				duration: 3000,
				panelClass: ['user-alert', 'warning']
			});
			return;
		}
		else {
			let form = {
				nsp: this.nsp,
				type: "cannedForm",
				formName: this.createForm.get('formName').value,
				formHeader: this.createForm.get('formHeader').value,
				formFooter: this.createForm.get('formFooter').value,
				actionType: this.createForm.get('actionType').value,
				actionUrl: this.createForm.get('actionUrl').value ? this.createForm.get('actionUrl').value : '',
				// actionUrl: this.createForm.get('actionType').value == "CustomUrl" ? this.createForm.get('actionUrl').value : actionurl,
				formFields: this.inputFields,
				formHtml: '',
				lastModified: { date: '', by: '' },
			}
			console.log(form);

			this.subscriptions.push(this.formDesignerService.insertForm(form).subscribe(response => {
				if (response.status == 'ok') {

				} else {

				}
			}));
		}
	}

	UpdateForm() {
		// this.EditedFields = [];
		// this.EditedFields = this.SelectedForm.formFields.concat(this.inputFields);
		// let actionurl;
		// this.formActions.map(action => {
		//   if (action.actionType == this.createForm.get('actionType').value) {
		//     actionurl = action.actionUrl;
		//   }
		// });

		let obj = {
			nsp: this.nsp,
			formName: this.createForm.get('formName').value,
			formHeader: this.createForm.get('formHeader').value,
			formFooter: this.createForm.get('formFooter').value,
			actionType: this.createForm.get('actionType').value,
			actionUrl: this.createForm.get('actionUrl').value ? this.createForm.get('actionUrl').value : '',
			// actionUrl: this.createForm.get('actionType').value == "CustomUrl" ? this.createForm.get('actionUrl').value : actionurl,
			formFields: this.inputFields,
			// formFields: this.EditedFields && this.EditedFields.length ? this.EditedFields : this.SelectedForm.formFields,
			formHTML: '',
			lastModified: { date: '', by: '' },
		}
		console.log(obj);

		this.subscriptions.push(this.formDesignerService.UpdateForm(this.SelectedForm._id, obj).subscribe(response => {
			if (response.status == 'ok') {
				this.editCase = false;
			}
		}));
	}

	moveUp(index: number) {
		if (index >= 1) {
			this.swap(this.inputFields, index, index - 1)
		}
		else {
			this.snackBar.openFromComponent(ToastNotifications, {
				data: {
					img: 'warning',
					msg: 'No fields above, Not allowed!'
				},
				duration: 2000,
				panelClass: ['user-alert', 'warning']
			});
		}
	}

	moveDown(index: number) {
		if (index < (this.inputFields.length) - 1) {
			this.swap(this.inputFields, index, index + 1)
		}
		else {
			this.snackBar.openFromComponent(ToastNotifications, {
				data: {
					img: 'warning',
					msg: 'No fields below, Not allowed!'
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

	CancelForm() {
		if (this.formChanges || (this.inputFields && this.inputFields.length)) {
			this.dialog.open(ConfirmationDialogComponent, {
				panelClass: ['confirmation-dialog'],
				data: { headermsg: 'Are you sure want to leave?' }
			}).afterClosed().subscribe(data => {
				if (data == 'ok') {
					this.formDesignerService.AddForm.next(false);
					this.formDesignerService.selectedForm.next(undefined);
					this.inputFields = [];
				} else {
					return;
				}
			});
		}
		else {
			this.formDesignerService.AddForm.next(false);
			this.formDesignerService.selectedForm.next(undefined);
			this.inputFields = [];
		}

	}

	Preview() {
		if (this.inputFields && this.inputFields.length && this.inputFields[0].label) {
			let transformingObj;
			let formInitials = {
				formHeader: this.createForm.get('formHeader').value,
				formFooter: this.createForm.get('formFooter').value,
				formName: this.createForm.get('formName').value,
			}

			transformingObj = Object.assign([], formInitials, this.inputFields)

			this.dialog.open(PreviewFormComponent, {
				panelClass: ['small-dialog'],
				disableClose: true,
				autoFocus: true,
				data: transformingObj

			}).afterClosed().subscribe(data => {
			});
		}
		else {
			this.snackBar.openFromComponent(ToastNotifications, {
				data: {
					img: 'warning',
					msg: 'Preview not available, Add data to field first!'
				},
				duration: 3000,
				panelClass: ['user-alert', 'warning']
			});
			return;
		}
	}

	TransformConditions(conditions?: Array<any>): FormGroup[] {
		let fb: FormGroup[] = [];
		conditions.forEach(condition => {
			fb.push(this.formbuilder.group({

				type: [condition.type,
				[
				]
				],
				fieldName: [condition.fieldName,
				[
					Validators.required,
					Validators.pattern(this.whiteSpace),
					Validators.maxLength(50),
					Validators.minLength(2),
				]
				],
				label: [condition.label,
				[
					Validators.required,
					Validators.maxLength(50),
					Validators.minLength(2),
				]
				],
				placeholder: [condition.placeholder,
				[
					// Validators.required,
					Validators.maxLength(50),
					Validators.minLength(2),
				]
				],
				validation: [condition.validation, []],
				options: this.fb.array([]),//, this.AtleastTwoKeyValue.bind(this)),
				value: [condition.value, [
					// Validators.required,
					Validators.maxLength(50),
					Validators.minLength(2),
				]
				]
			}));
		})

		return fb;
	}

	TransformValues(options) {
		let fb: FormGroup[] = [];
		options.forEach(option => {

			fb.push(this.formbuilder.group({
				key: [option.key,
				[
					Validators.required
				]
				],
				value: [option.value,
				[
					Validators.required
				]

				]
			}))
		});
		return fb;
	}

	ParseFormInput(inputForm: FormArray): any {

		let obj = {};
		let type = this.currentElement.id.split('_')[1];
		console.log(type);

		inputForm.controls.map((control, index) => {
			switch (type) {
				case 'radio':
					obj = {
						id: this.currentElement.id,
						type: type,
						fieldName: control.get('fieldName').value.toLowerCase(),
						label: control.get('label').value,
						validation: control.get('validation').value,
						placeholder: '',
						value: '',
						options: this.ParseValues((<FormArray>(<FormGroup>(<FormArray>this.createForm.controls['conditions']).controls[index]).controls['options']))
					}
					break;
				case 'dropdown':
					obj = {
						id: this.currentElement.id,
						type: "dropdown",
						fieldName: control.get('fieldName').value.toLowerCase(),
						label: control.get('label').value,
						placeholder: '',
						validation: control.get('validation').value,
						value: '',
						options: this.ParseValues((<FormArray>(<FormGroup>(<FormArray>this.createForm.controls['conditions']).controls[index]).controls['options']))
					}
					break;
				case 'input':
					obj = {
						id: this.currentElement.id,
						type: control.get('type').value,
						fieldName: control.get('fieldName').value.toLowerCase(),
						label: control.get('label').value,
						placeholder: control.get('placeholder').value ? control.get('placeholder').value : '',
						validation: control.get('validation').value,
						value: '',
						options: [],
					}
					break;
				case 'checkbox':
					obj = {
						id: this.currentElement.id,
						type: "checkbox",
						fieldName: control.get('fieldName').value.toLowerCase(),
						label: control.get('label').value,
						validation: control.get('validation').value,
						placeholder: '',
						value: control.get('value').value,
						options: []
					}
					break;
				default:
					obj = {}
			}
		});
		return obj;
	}

	ParseValues(formArray: FormArray): any {
		let formInputsOptions = [];

		formArray.controls.map(control => {
			let obj = {
				key: control.get('key').value ? control.get('key').value : '',
				value: control.get('value').value ? control.get('value').value : '',
			}
			formInputsOptions.push(obj);
		});
		return formInputsOptions;
	}

	ngOnDestroy() {
		this.formDesignerService.AddForm.next(false);
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
	}

	GetControls(name: string) {
		return (this.createForm.get(name) as FormArray).controls;
	}

	patchValues(label, value) {
		return this.fb.group({
			key: [label],
			value: [value]
		})
	}

	deletekeyValue(index) {
		(<FormArray>(<FormGroup>(<FormArray>this.createForm.controls['conditions']).controls[0]).controls['options']).removeAt(index);
	}

	addkeyValue() {

		const fg = this.fb.group({
			'key': ['', Validators.compose([Validators.required])],
			'value': ['', Validators.compose([Validators.required])]
		});
		(<FormArray>(<FormGroup>(<FormArray>this.createForm.controls['conditions']).controls[0]).controls['options']).push(fg);

	}

}




























