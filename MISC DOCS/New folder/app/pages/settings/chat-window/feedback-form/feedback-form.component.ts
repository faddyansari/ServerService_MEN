import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs/Observable';
import { ChatWindowCustomizations } from '../../../../../services/LocalServices/ChatWindowCustomizations';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import { ToastNotifications } from '../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { ConfirmationDialogComponent } from '../../../../dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
	selector: 'app-feedback-form',
	templateUrl: './feedback-form.component.html',
	styleUrls: ['./feedback-form.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: []
})
export class FeedbackForm {

	private subscriptions: Subscription[] = [];
	public displaySettings: any = undefined;
	public form: FormGroup;
	public enableEdit = false;
	public loading = false;

	//Only Letters Regex
	private pattern = /^[a-z][a-z.\s-]{1,255}$\?*/i;
	themeSettings: any;

	//inputFields: Array<any> = []

	//custom Fields

	customFields: Array<any> = [];
	saving = false;
	public CustomFormFields: FormGroup
	public selectedField: FormGroup
	public feedBackSettings: FormGroup
	public selectedIndex = -1;
	previousCustomFields: FormGroup

	constructor(private _chatWindowCustomizations: ChatWindowCustomizations,
		private _appStateService: GlobalStateService,
		private formbuilder: FormBuilder,
		public snackBar: MatSnackBar,
		public dialog: MatDialog,
	) {
		this._appStateService.contentInfo.next('');
		this._appStateService.breadCrumbTitle.next('Chat Window Customizations');
		this.subscriptions.push(this._chatWindowCustomizations.GetDisplaySettings().subscribe(displaySettings => {
			if (displaySettings) {
				this.displaySettings = displaySettings.settings.chatwindow.feedbackForm;
				this.themeSettings = displaySettings.settings.chatwindow.dialogSettings;
				this.customFields = displaySettings.settings.chatwindow.feedbackForm.customFields
				this.enableEdit = false;
				this.form = formbuilder.group({
					'query1': [
						this.displaySettings.query1,
						[
							Validators.required,
							//Validators.pattern(this.pattern)
						]
					],
					'query2': [
						this.displaySettings.query2,
						[
							Validators.required,
							//Validators.pattern(this.pattern)
						]
					]
				});


				this.feedBackSettings = formbuilder.group({
					'feedbackRequired': [
						(this.displaySettings.feedbackRequired) ? this.displaySettings.feedbackRequired : false
					]
				});
				//if (this.customFields && this.customFields.length) {
				this.CustomFormFields = this.formbuilder.group({
					fields: this.formbuilder.array((this.customFields && this.customFields.length) ? this.TransformFields(this.customFields) : [])
				});
				this.previousCustomFields = this.formbuilder.group({
					fields: this.formbuilder.array((this.customFields && this.customFields.length) ? this.TransformFields(this.customFields) : [])
				});
				//}
				// if (this.customFields && this.customFields.length) {
				// 	this.CustomFormFields = this.formbuilder.group({
				// 		fields: this.formbuilder.array(this.TransformFields(this.customFields))
				// 	});
				// }
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
	}


	public EnableEdit(value: boolean) {
		if (this.CustomFormFields.value.fields && this.CustomFormFields.value.fields.length && this.enableEdit) {
			this.dialog.open(ConfirmationDialogComponent, {
				panelClass: ['confirmation-dialog'],
				data: { headermsg: 'Are you sure you want to cancel edited changes? All changes will be lost.' }
			}).afterClosed().subscribe(data => {
				if (data == 'ok') {
					this.enableEdit = value;

					this.CustomFormFields = this.previousCustomFields
					//this.inputFields = [];

					// let fields = this.CustomFormFields.get('fields') as FormArray;
					// if (fields && this.CustomFormFields && this.CustomFormFields.value) {
					// 	this.CustomFormFields.value.fields.map((f, i) => {
					// 		fields.removeAt(i)
					// 	})
					// }
					// this.CustomFormFields.reset()

					//this.customFields = this.previousCustomFields

					if (!value) {
						this.form.get('query1').setValue(this.displaySettings.query1);
						this.form.get('query2').setValue(this.displaySettings.query2);
						this.form.updateValueAndValidity();
					}

				}
			});

		}
		else {
			//this.inputFields = []
			//this.CustomFormFields = this.previousCustomFields
			this.enableEdit = value;
			if (!value) {
				this.form.get('query1').setValue(this.displaySettings.query1);
				this.form.get('query2').setValue(this.displaySettings.query2);
				this.form.updateValueAndValidity();
			}
		}

	}

	public SubmitForm() {
		this.loading = true;
		this._chatWindowCustomizations.UpdateChatWindowContentSettings('feedbackForm', {
			query1: this.form.get('query1').value,
			query2: this.form.get('query2').value,
			btn1Text: this.displaySettings.btn1Text,
			btn2Text: this.displaySettings.btn2Text,
			transcriptContent: this.displaySettings.transcriptContent,
			feedbackRequired: this.feedBackSettings.get('feedbackRequired').value,
			customFields: (this.CustomFormFields.value.fields && this.CustomFormFields.value.fields.length) ? this.CustomFormFields.value.fields : []
		}).subscribe(response => {
			this.loading = false;
			if (response.status == 'ok') {
				//Todo Completion Logic Here
				// let fields = this.CustomFormFields.get('fields') as FormArray;
				// if (fields && this.CustomFormFields && this.CustomFormFields.value) {
				// 	this.CustomFormFields.value.fields.map((f, i) => {
				// 		fields.removeAt(i)
				// 	})
				// }
				//this.CustomFormFields.reset()

				this.previousCustomFields = this.CustomFormFields
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'ok',
						msg: 'Fields Updated successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				});
			}
		}, err => {
			this.loading = false;
			this.snackBar.openFromComponent(ToastNotifications, {
				data: {
					img: 'warning',
					msg: 'Unable to Update Field!'
				},
				duration: 2000,
				panelClass: ['user-alert', 'error']
			});
			//Todo Error View Logic Here
		})
		//this.inputFields = []
	}

	TransformFields(fields?: Array<any>): FormGroup[] {
		let fb: FormGroup[] = [];
		fields.map(field => {
			fb.push(this.formbuilder.group({
				label: [field.label, Validators.required],
				name: [field.name, Validators.required],
				type: [field.type, Validators.required],
				isCollection: [field.isCollection, Validators.required],
				required: [field.required, Validators.required],
				default: [field.default, Validators.required],
				elementType: [field.elementType, Validators.required],
				placeholder: [(field.placeholder) ? field.placeholder : ''],
				value: [(field.value) ? field.value : ''],
				options: [field.options],
				mandatory : [(field.mandatory) ? field.mandatory : false]
			}));

		});

		return fb;
	}

	TransformOptions(options?: Array<any>): FormGroup[] {
		////console.log(options);

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
		return (this.CustomFormFields.get('fields') as FormArray).controls;
	}

	drag(event) {
		// event.preventDefault();
		// event.stopPropagation();
		// event.stopImmediatePropagation();
		// event.dataTransfer.setData("text", event.target.id);
		// //console.log('Drage Start', event);
		event.dataTransfer.setData("text", event.target.id);

		////console.log('Drag Start', event.dataTransfer.getData("text"))

	}

	drop(event) {
		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation();
		////console.log('Drop', event.dataTransfer.getData("text"));
		this.isDragged = false;
		// let el = document.getElementById(event.dataTransfer.getData("text"));
		// if (el) {
		// 	el.draggable = false;
		// }
		this.AddField(event.dataTransfer.getData("text"))

		// var data = ev.dataTransfer.getData("text");
		// ev.target.appendChild(document.getElementById(data));
	}

	AddField(value: string) {
		let fb: FormGroup;

		switch (value.trim()) {
			case "checkbox":
				fb = this.formbuilder.group({
					label: ['Checkbox', [Validators.required]],
					name: [null, [Validators.required]],
					type: ['boolean'],
					isCollection: [false],
					required: [false, Validators.required],
					default: [false, Validators.required],
					elementType: ['checkbox', Validators.required],
					value: [null],
					options: [[]],
					mandatory : [null]
				})
				break;

			case "date":
				fb = this.formbuilder.group({
					label: ['Datebox', [Validators.required]],
					name: [null, [Validators.required]],
					type: ['string'],
					isCollection: [false],
					required: [false, Validators.required],
					default: [false, Validators.required],
					elementType: ['date', Validators.required],
					value: [''],
					options: [[]],
					mandatory : [null]
				})
				break;
			case "textbox":
				fb = this.formbuilder.group({
					label: ['Textbox', [Validators.required]],
					name: [null, [Validators.required]],
					type: ['string'],
					isCollection: [false],
					required: [false, Validators.required],
					default: [false, Validators.required],
					elementType: ['text', Validators.required],
					placeholder: [''],
					value: [''],
					options: [[]],
					mandatory : [null]
				})
				break;
			case "dropdown":
				fb = this.formbuilder.group({
					label: ['Select Option', [Validators.required]],
					name: [null, [Validators.required]],
					type: ['string'],
					isCollection: [false],
					required: [false, Validators.required],
					default: [false, Validators.required],
					elementType: ['dropdown', Validators.required],
					value: [''],
					options: [[]],
					mandatory : [null]
				})

				break;
			case "radio":
				fb = this.formbuilder.group({
					label: ['Radio Button', [Validators.required]],
					name: [null, [Validators.required]],
					type: ['boolean'],
					isCollection: [false, Validators.required],
					required: [false, Validators.required],
					default: [false, Validators.required],
					elementType: ['radio', Validators.required],
					value: [''],
					placeholder: [''],
					options: [[]],
					mandatory : [null]
				})
				break;
		}

		let fields = this.CustomFormFields.get('fields') as FormArray;

		fields.push(fb);
		//this.inputFields.push(fb.value);
		//console.log(this.inputFields);
	}

	SetEdit(i) {

		let fields = this.CustomFormFields.get('fields') as FormArray;
		fields.controls[i].value;
		this.selectedIndex = i;

		this.selectedField = this.formbuilder.group({
			label: [fields.controls[i].value.label, [Validators.required]],
			name: [fields.controls[i].value.name, [Validators.required]],
			type: [fields.controls[i].value.type],
			isCollection: [fields.controls[i].value.isCollection],
			required: [fields.controls[i].value.required, Validators.required],
			default: [false, Validators.required],
			elementType: [fields.controls[i].value.elementType, Validators.required],
			value: [fields.controls[i].value.value],
			placeholder: [(fields.controls[i].value.placeholder) ? fields.controls[i].value.placeholder : ''],
			options: this.formbuilder.array(this.TransformOptions(fields.controls[i].value.options)),
			mandatory : [(fields.controls[i].value.mandatory) ? fields.controls[i].value.mandatory : '']

		})

	}

	SetCheckBoxValue(event) {

		if (((this.selectedField.get('elementType').value == 'checkbox') || (this.selectedField.get('elementType').value == 'radio')) && (event.target.value == 'true' || event.target.value == 'false')) this.selectedField.get('value').setValue((event.target.value == 'true') ? true : false)
		else this.selectedField.get('value').setValue('')
	}

	SaveField() {
		let fields = this.CustomFormFields.get('fields') as FormArray;
		fields.at(this.selectedIndex).patchValue(this.selectedField.value)

		// console.log(this.CustomFormFields);

		// console.log(fields);

		//this.inputFields[this.selectedIndex] = this.selectedField.value;
		//fields.at(this.selectedIndex).get('options').patchValue(this.formbuilder.array(this.TransformOptions(this.selectedField.get('options').value)));
		// //console.log('selectedField Value : ', this.selectedField.value);
		this.selectedField = undefined;
		this.selectedIndex = -1;
	}

	DeleteField(i) {
		let fields = this.CustomFormFields.get('fields') as FormArray;
		//this.inputFields.splice(i, 1);
		fields.removeAt(i);
		this.selectedField = undefined;
		this.selectedIndex = -1;

		//console.log(this.inputFields);
		//console.log(this.inputFields[this.selectedIndex]);

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
		////console.log('Drag End');
	}


	AddOption() {
		let fb = this.formbuilder.group({
			name: ['', [Validators.required]],
			value: [(this.selectedField.get('elementType').value == 'radio') ? null : '', [Validators.required]],
		});
		let options = this.selectedField.get('options') as FormArray;
		////console.log(options);

		options.push(fb);

	}
	GetOptionsDisplay(field: FormGroup) {
		let fa = field.get('options') as FormArray;
		////console.log(field);
		return fa.controls;

	}

	DeleteOption(i) {
		let fa = this.selectedField.get('options') as FormArray;
		// //console.log('index',i);
		// //console.log('option',fa);
		fa.removeAt(i);
	}

	public GetOptions() {
		return (this.selectedField.get('options') as FormArray).controls;
	}

	Clear() {

		this.selectedField = undefined;
		this.selectedIndex = -1;
	}

	OrderUp(index) {
		let fields: Array<any> = (this.CustomFormFields.value.fields as Array<any>);
		let customFields = this.CustomFormFields.get('fields') as FormArray;
		if (fields.length && index >= 1) {
			let previousValue = fields[index - 1];
			customFields.at(index - 1).patchValue(fields[index])
			customFields.at(index).patchValue(previousValue)
			fields[index - 1] = fields[index]
			fields[index] = previousValue
		}
		else return

	}

	OrderDown(index) {
		let fields: Array<any> = (this.CustomFormFields.value.fields as Array<any>);
		let customFields = this.CustomFormFields.get('fields') as FormArray;
		if (fields.length && index < fields.length - 1) {
			let next = fields[index + 1];
			customFields.at(index + 1).patchValue(fields[index])
			customFields.at(index).patchValue(next)
			fields[index + 1] = fields[index]
			fields[index] = next
		}
		else return

	}

}
