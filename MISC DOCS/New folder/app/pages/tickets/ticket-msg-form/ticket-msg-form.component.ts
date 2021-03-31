import { Component, OnInit, ViewEncapsulation, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
declare var $: any;
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { PopperContent } from 'ngx-popper';
import { UploadingService } from '../../../../services/UtilityServices/UploadingService';

@Component({
	selector: 'app-ticket-msg-form',
	templateUrl: './ticket-msg-form.component.html',
	styleUrls: ['./ticket-msg-form.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class TicketMsgFormComponent implements OnInit {

	@ViewChild('msgBox') msgBox: any;
	@Input('to') to = '';
	@Input('cc') cc = [];
	@Input('from') from = '';
	@Input('subject') subject = '';
	@Input('threadMessage') threadMessage: any;
	@Input('tid') tid = [];
	@Input("type") type = 'reply';

	@Input('sending') sending = false;
	@Input('form') CannedFormsList = [];
	@Input('automatedResponses') automatedResponses = [];
	@Input('survey') survey = [];

	@Output('delete') delete = new EventEmitter();
	@Output('message') message = new EventEmitter();
	@Output('redirectToAR') redirectToAR = new EventEmitter();

	@ViewChild('fileInput') fileInput: ElementRef;
	@ViewChild('cannedMessages') cannedMessagePopper: PopperContent;
	@ViewChild('cannedResponsePopper') cannedResponsePopper: PopperContent;

	public msgForm: FormGroup;
	private emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	showCC = false;
	showBCC = false;

	selectedForm: any = undefined
	selectedFeedbackSurvey = false;
	formRef: any = undefined
	SurveyList = []

	config: any = {
		placeholder: 'Enter your message here ...',
		height: 250,
		// uploadImagePath: '',
		toolbar: [
			['style', ['bold', 'italic', 'underline']],
			['fontname', ['fontname']],
			['fontsize', ['fontsize']],
			['color', ['color']],
			['fontName', ['fontName']],
			['para', ['ul', 'ol', 'paragraph']],
			['height', ['height']],
			['insert', ['linkDialogShow', 'unlink', 'hr']],
			['view', ['codeview', 'undo', 'redo']]
		]
	};

	displayMessage = '';

	constructor(private formbuilder: FormBuilder, private _uploadingService: UploadingService) {

	}

	ngOnInit() {
		// console.log(this.cc);

		let temp: FormGroup[] = [];
		this.msgForm = this.formbuilder.group({
			'to':
				[
					{ value: ((this.type == 'reply') || (this.type == 'reply-all')) ? [this.to] : [], disabled: ((this.type == 'reply') || (this.type == 'reply-all')) ? true : false },
					[
						Validators.required,
					],
					this.CheckEmail.bind(this)
				],
			'from':
				[
					this.from,
					[
						Validators.required,
					],
					this.CheckEmail.bind(this)
				],
			'subject':
				[
					{ value: this.subject, disabled: (this.type == 'fwd') ? false : true },
					[
						Validators.required
					],
				],
			'msg':
				[
					'',
					[],
				],
			'cc': [
				this.cc,
				[],
				this.CheckEmail.bind(this)
			],
			'bcc': [
				[],
				[],
				this.CheckEmail.bind(this)
			],
			'attachments': this.formbuilder.array(temp)
		});
		if (this.type == 'reply-all') {
			// console.log(this.cc);
			// console.log([this.to]);
			// setTimeout(() => {
			//   this.msgForm.get('cc').setValue(this.cc);
			// }, 0);
			this.showCC = true;
		}

		if (this.threadMessage) {
			let thread = this.threadMessage;
			if (thread.type == 'forward') this.displayMessage += "<br><br><hr class='bg-theme-gray'><br>---------- Forwarded message ---------";
			else this.displayMessage += '<br><br><hr><br>---------- In reply to ---------'
			this.displayMessage += '<br><br>From: ' + thread.data.from;
			this.displayMessage += '<br>Date: ' + new Date(thread.data.date).toLocaleString();
			this.displayMessage += '<br>Subject: ' + thread.data.subject;
			this.displayMessage += '<br>To: ' + thread.data.to;
			this.displayMessage += '<br><br>' + thread.data.body;
			if (this.displayMessage) {
				this.msgForm.get('msg').setValue(this.displayMessage);
			}
		}


		// this.msgForm.get('cc').valueChanges.subscribe(val => {
		//   console.log(val);
		// })
	}
	ngAfterViewInit() {
		// (this.msgBox.nativeElement as HTMLTextAreaElement).setSelectionRange(0,0);
		setTimeout(() => {
			this.msgBox.nativeElement.focus();
			this.msgBox.nativeElement.setSelectionRange(0, 0);

		}, 100);
		// $('#msgBox').summernote({
		// 	callbacks: {
		// 		onPaste: (e) => {
		// 			console.log(e);
		// 		}
		// 	}
		// });
		// $('#msgBox').summernote({
		// 	callbacks: {
		// 		onImageUpload: function (data) {
		// 			data.pop();
		// 			// upload image to server and create imgNode...
		// 		}
		// 	}
		// });
		// $('#msgBox').on('summernote.paste', (e) => {
		// 	// e.preventDefault();
		// 	// console.log(e);
		// 	// console.log('Called event paste');
		// });
		// $('#msgBox').on('summernote.image.upload', function (e, files) {
		// 	// upload image to server and create imgNode...
		// 	// e.preventDefault();
		// 	// console.log(e);
		// 	console.log((this as ElementRef).nativeElement);
		// 	console.log(files);

		// 	// files.pop();

		// 	// $summernote.summernote('insertNode', imgNode);
		// });

	}

	// uploadImageContent(file: File, editor) {
	// 	// (image[0] as HTMLImageElement).setAttribute('id', '')
	// 	// $(editor).summernote('insertNode', image[0]);
	// 	this._uploadingService.GenerateLinks([file], 'SendAttachMent').subscribe(response => {
	// 		// console.log(response);
	// 		if (response && response.length) {
	// 			let image = $('<img>').attr('src', response[0].path);
	// 			$(editor).summernote('insertNode', image[0]);
	// 		}
	// 	}, err => {
	// 		console.log("file not sent", err);
	// 	});
	// }





	public CheckEmail(control: FormControl) {
		let valid = true;
		let value = (Array.isArray(control.value) ? control.value : [control.value]);
		// console.log(value);

		value.map(email => {
			// console.log(email);

			if (!this.emailPattern.test(email)) valid = false;
		})

		// console.log(value + ' - ' + valid);


		if (!valid) return Observable.of({ 'invalid': true });
		else return Observable.of(null);
	}

	public Delete() {
		this.delete.emit(true)
	}

	public FileSelected(event: Event) {

		for (let i = 0; i < this.fileInput.nativeElement.files.length; i++) {
			if (this.fileInput.nativeElement.files.length > 0) {
				this.readURL(this.fileInput.nativeElement.files[i]).then(url => {
					let fb: FormGroup = this.formbuilder.group({
						file: [
							this.fileInput.nativeElement.files[i],
							[
								Validators.required
							]
						],
						name: [
							this.fileInput.nativeElement.files[i].name
						],
						url: url
					})
					let attachments = this.msgForm.get('attachments') as FormArray;
					attachments.push(fb);

				})

				// this.files.push(this.fileInput.nativeElement.files[i]);
				// this.filenames.push(this.fileInput.nativeElement.files[i]);
			}
		}

	}

	GetControls(name: string) {
		return (this.msgForm.get(name) as FormArray).controls;
	}
	RemoveAttachment(i) {
		let attachments = this.msgForm.get('attachments') as FormArray;
		attachments.removeAt(i);
	}

	public ClearFile() {

		this.msgForm.get('attachments').setValue(new FormArray([]));
		this.fileInput.nativeElement.value = '';
	}

	readURL(Attachment: File): Promise<any> {
		return new Promise((resolve, reject) => {

			let picReader = new FileReader();

			picReader.addEventListener("load", (event: any) => {
				resolve(event.target.result)
			});
			picReader.readAsDataURL(Attachment);

		})

	}

	ToggleBCC(event: Event) {
		//console.log('Toggling BCC');
		// event.stopImmediatePropagation();
		// event.stopPropagation();
		this.showBCC = !this.showBCC;
		this.msgForm.get('bcc').setValue([]);
		// let temp = (this.msgForm.get('bcc') as FormArray);
		// while (temp.length) { temp.removeAt(0); }
	}

	ToggleCC(event: Event) {
		//console.log('Toggling CC');
		// event.stopImmediatePropagation();
		// event.stopPropagation();
		// console.log(this.cc);
		this.showCC = !this.showCC;
		this.msgForm.get('cc').setValue(this.cc);
		// console.log(this.msgForm.get('cc').value);


		// let temp = (this.msgForm.get('cc') as FormArray);
		// while (temp.length) { temp.removeAt(0); }
	}

	Send(event: Event) {
		event.preventDefault();
		this.message.emit({
			to: this.msgForm.get('to').value,
			from: this.msgForm.get('from').value,
			body: this.msgForm.get('msg').value,
			cc: this.msgForm.get('cc').value,
			bcc: this.msgForm.get('bcc').value,
			attachments: this.msgForm.get('attachments').value,
			subject: this.msgForm.get('subject').value,
			form: (this.formRef) ? this.formRef : '',
			submittedForm: (this.selectedForm && this.selectedForm.length) ? this.selectedForm : [],
			surveyAttached: (this.selectedFeedbackSurvey) ? true : false,
			threadMessage: this.threadMessage
		})

	}

	RemoveForm() {
		this.selectedForm = undefined;
	}
	SelectActivatedPolicy() {
		this.selectedFeedbackSurvey = true;
	}
	RemoveSurveyForm() {
		this.selectedFeedbackSurvey = false;
	}

	//cannedMessages popper region

	UpdateCannedMessages(form) {
		this.cannedMessagePopper.hide();
		if (form) {
			this.formRef = {
				id: form._id,
				type: "cannedForm"
			}
			this.selectedForm = [form];
		}
	}

	InsertCannedMessage(hashTag) {
		let result = '';
		this.automatedResponses.map(val => {
			if (val.hashTag == hashTag) {
				result = val.responseText;
			}
		});
		this.msgForm.get('msg').setValue(this.msgForm.get('msg').value + ' ' + result.toString());
		this.cannedResponsePopper.hide();
	}

	GotoAR() {
		this.redirectToAR.emit(true);
	}


	SetCannedMessages(event: Event, form: any) {
	}

	popperOnUpdateCannedMessage(event: Event) {
	}

	popperOnHidden(event: Event) {
	}

}
