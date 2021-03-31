import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UploadingService } from '../../../../../services/UtilityServices/UploadingService';
import { KnowledgeBaseService } from '../../../../../services/LocalServices/KnowledgeBase';
import { ConfirmationDialogComponent } from '../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ToastNotifications } from '../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../../../../services/AuthenticationService';

@Component({
	selector: 'app-docunments',
	templateUrl: './docunments.component.html',
	styleUrls: ['./docunments.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [
		KnowledgeBaseService
	]
})
export class DocunmentsComponent implements OnInit {
	documentForm: FormGroup;
	docSearchForm: FormGroup;
	file: File;
	loading = false;
	knowledgeBaseList = [];
	docType = '';
	fetching = true;

	subscription: Subscription[] = []
	package = undefined;

	months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	]

	constructor(private formBuilder: FormBuilder,
		private _uploadingService: UploadingService,
		private _knowledgeBaseService: KnowledgeBaseService,
		private snackBar: MatSnackBar,
		private dialog: MatDialog,
		private _appStateService: GlobalStateService,
		private _authService: AuthService,

	) {
		this.subscription.push(this._authService.getPackageInfo().subscribe(pkg => {
			// console.log(data);
			if (pkg) {
				this.package = pkg.knowledgebase;
				if (!this.package.allowed) {
					this._appStateService.NavigateTo('/noaccess');
				}
			}
		}));
		this._appStateService.contentInfo.next('');
		this._appStateService.breadCrumbTitle.next('Knowledge Base');
		_knowledgeBaseService.GetKnowledgeBase('documents');
		_knowledgeBaseService.knowledgeBaseList.subscribe(data => {
			if (data) {
				this.knowledgeBaseList = data;
			}
		});
		_knowledgeBaseService.fetching.subscribe(data => {
			this.fetching = data;
		});
		this.documentForm = formBuilder.group({
			'file': [
				null,
				[
					Validators.required,
				]
			],
			'type': [
				null,
				[
					Validators.required
				]
			],
			'title': [
				null,
				[
					Validators.required,
					Validators.maxLength(50)
				]
			],
			'description': [
				null
			]
		});
		this.docSearchForm = formBuilder.group({
			'searchValue': ['', [],]
		});

	}

	Change(event) {
		if (event.target.files && event.target.files.length) {
			this.file = event.target.files[0];
		}
	}

	ngOnInit() { }

	Submit() {
		this.loading = true;
		if (!this.file) return;
		this._uploadingService.SignRequest(this.file, 'knowledgebase', {
			params: {
				"folderName": this.documentForm.get('type').value
			}
		}).subscribe(response => {

			let params = JSON.parse(response.text());
			params.file = this.file

			this._uploadingService.uploadAttachment(params).subscribe(s3response => {
				// console.log(s3response.status);

				if (s3response.status == '201') {
					console.log(s3response.text());
					this._uploadingService.parseXML(s3response.text()).subscribe(json => {
						let url = json.response.PostResponse.Location[0];
						if (this.documentForm.get('type').value == 'news') {
							url = 'https://app.beelinks.solutions/' + params.key;
						}
						this._knowledgeBaseService.AddKnowledgeBase({
							group: '',
							subGroup: '',
							url: url,
							fileName: this.documentForm.get('title').value,
							month: this.months[new Date().getMonth()],
							year: new Date().getFullYear(),
							type: this.documentForm.get('type').value,
							description: this.documentForm.get('description').value,
							active: true
						}).subscribe(response => {
							this.loading = false;

							if (response.status == 'ok') {
								this.documentForm.reset();
								this.showSuccess();
							}
						}, err => {
							this.showError(err);
							this.loading = false;

						})
					}, err => {
						this.showError(err);
						this.loading = false;

					});
				}

			}, err => {
				this.loading = false;
				this.showError(err);

			});
		}, err => {

			this.loading = false;
			this.showError(err);

			Object.keys(err.errorList).map(key => {
				switch (key) {
					case 'typeError':
						if (err.errorList[key]) this.documentForm.get('file').setErrors({
							'typeError': true
						});
						break;
					case 'nameError':
						if (err.errorList[key]) this.documentForm.get('file').setErrors({
							'nameError': true
						})
						break;
					case 'requestError':
						if (err.errorList[key]) this.documentForm.get('file').setErrors({
							'requestError': true
						})
						break;
					case 'folderError':
						if (err.errorList[key]) this.documentForm.get('file').setErrors({
							'folderError': true
						})
						break;
				}
			})
		});
	}

	typeChanged(value) {
		this.docType = value;
	}

	filterBy(value): Array<any> {
		if (value) {
			return this.knowledgeBaseList.filter(data => data.type == value);
		} else {
			return this.knowledgeBaseList;
		}
	}

	Remove(type, filename) {
		this.dialog.open(ConfirmationDialogComponent, {
			panelClass: ['confirmation-dialog'],
			data: {
				headermsg: 'Are you sure you want To delete this file?'
			}
		}).afterClosed().subscribe(data => {
			if (data == 'ok') {
				this._knowledgeBaseService.RemoveKnowledgeBase(type, filename);
			}
		});
	}

	ToggleActivate(type, filename, active) {
		console.log(filename);
		this._knowledgeBaseService.ToggleActivate(type, filename, active);
	}

	showError(err) {
		this.snackBar.openFromComponent(ToastNotifications, {
			data: {
				img: 'warning',
				msg: err
			},
			duration: 3000,
			panelClass: ['user-alert', 'error']
		});
	}
	showSuccess() {
		this.snackBar.openFromComponent(ToastNotifications, {
			data: {
				img: 'ok',
				msg: 'File uploaded successfully!'
			},
			duration: 3000,
			panelClass: ['user-alert', 'success']
		});
	}
	ngOnDestroy(): void {
		//Called once, before the instance is destroyed.
		//Add 'implements OnDestroy' to the class.
		this._knowledgeBaseService.Destroy();
	}
}
