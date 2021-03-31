import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { TicketsService } from '../../../../../services/TicketsService';
import { Subscription } from 'rxjs/Subscription';
import { ConfirmationDialogComponent } from '../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import { MatDialog, MatSnackBar } from '@angular/material';
import { PopperContent } from 'ngx-popper';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastNotifications } from '../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { AuthService } from '../../../../../services/AuthenticationService';

@Component({
	selector: 'app-ticket-response',
	templateUrl: './ticket-response.component.html',
	styleUrls: ['./ticket-response.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class TicketResponseComponent implements OnInit {
	@ViewChild('previewPopper') previewPopper: PopperContent

	shiftdown = false;
	loading = false;
	signatureHeader = '';
	signatureFooter = '';
	id = '';
	signList = [];
	update = false;

	subscriptions: Subscription[] = [];

	showSignatureForm = false;
	previewTemplateHeader: any;
	previewTemplateFooter: any;
	configHeader: any = {
		placeholder: 'Enter signature header..',
		toolbar: [
			['style', ['bold', 'italic', 'underline', 'clear']],
			['fontname', ['fontname']],
			['table', ['table']],
			['font', ['strikethrough', 'superscript', 'subscript']],
			['fontstyle', ['backcolor']],
			['fontsize', ['fontsize']],
			['color', ['color']],
			['para', ['ul', 'ol', 'paragraph']],
			['height', ['height']],
			['insert', ['linkDialogShow', 'unlink']],
			['view', ['fullscreen', 'codeview', 'help', 'undo', 'redo']]
		]
	};

	configFooter: any = {
		placeholder: 'Enter signature footer..',
		toolbar: [
			['style', ['bold', 'italic', 'underline', 'clear']],
			['fontname', ['fontname']],
			['table', ['table']],
			['font', ['strikethrough', 'superscript', 'subscript']],
			['fontstyle', ['backcolor']],
			['fontsize', ['fontsize']],
			['color', ['color']],
			['para', ['ul', 'ol', 'paragraph']],
			['height', ['height']],
			// ['insert', ['unlink', 'link', 'picture']],
			['insert', ['linkDialogShow', 'unlink']],

			['view', ['fullscreen', 'codeview', 'help', 'undo', 'redo']]

		]
	};
	package: any;

	constructor(
		private _ticketService: TicketsService,
		private _authService: AuthService,
		private dialog: MatDialog,
		private _globalApplicationStateService: GlobalStateService,
		private sanitized: DomSanitizer,
		public snackBar: MatSnackBar
	) {
		this._globalApplicationStateService.contentInfo.next('');
		this._globalApplicationStateService.breadCrumbTitle.next('Ticket Management');
		this.subscriptions.push(_authService.getPackageInfo().subscribe(pkg => {
			if (pkg) {
				this.package = pkg.tickets.signatures;
				if(!this.package.allowed){
					this._globalApplicationStateService.NavigateTo('/noaccess');
				}
			}
			// console.log(agent);
		}));
		this.subscriptions.push(this._ticketService.signList.subscribe(data => {
			this.signList = data;
		}));
	}

	ngOnInit() {

	}

	SaveSignature() {

		this.loading = true;
		this._ticketService.SaveSignature(
			{
				header: this.signatureHeader,
				footer: this.signatureFooter
			}).subscribe(data => {
				if (data) {
					this.signatureHeader = '';
					this.signatureFooter = '';
					this.loading = false;
					this.showSignatureForm = false;
					this.snackBar.openFromComponent(ToastNotifications, {
						data: {
							img: 'ok',
							msg: 'Signature added successfully!'
						},
						duration: 2000,
						panelClass: ['user-alert', 'success']
					});
				}
			});
	}

	UpdateSignature() {
		this.loading = true;
		this._ticketService.UpdateSignature(
			{
				header: this.signatureHeader,
				footer: this.signatureFooter,
				id: this.id,
				lastModified: ''
			}).subscribe(res => {

				if (res) {
					this.signatureHeader = '';
					this.signatureFooter = '';
					this.id = '';
					this.loading = false;
					this.update = false;
					this.showSignatureForm = false;
					this.snackBar.openFromComponent(ToastNotifications, {
						data: {
							img: 'ok',
							msg: 'Signature updated successfully!'
						},
						duration: 2000,
						panelClass: ['user-alert', 'success']
					});
				}
			});
	}

	Toggle(signId, flag) {
		this.signList.map(val => {
			if (val.active) {
				val.active = false;
				return;
			}
		});
		this._ticketService.ToggleSignatures(signId, flag).subscribe(res => {
			if (res.status == "ok") {
				if(flag){
					this.snackBar.openFromComponent(ToastNotifications, {
						data: {
							img: 'ok',
							msg: 'Signature activated successfully!'
						},
						duration: 2000,
						panelClass: ['user-alert', 'success']
					});
				}
				else{
					this.snackBar.openFromComponent(ToastNotifications, {
						data: {
							img: 'ok',
							msg: 'Signature deactivated successfully!'
						},
						duration: 2000,
						panelClass: ['user-alert', 'success']
					});
				}
			}
		});

	}

	toggleSignatureForm() {
		if (this.signatureFooter || this.signatureHeader) {
			this.dialog.open(ConfirmationDialogComponent, {
				panelClass: ['confirmation-dialog'],
				data: { headermsg: 'Are you sure want to leave?' }
			}).afterClosed().subscribe(data => {
				if (data == 'ok') {
					this.showSignatureForm = !this.showSignatureForm;
					this.signatureFooter = ''
					this.signatureHeader = ''
				} else {
					return;
				}
			});
		}
		else {
			this.showSignatureForm = !this.showSignatureForm;
			this.signatureFooter = ''
			this.signatureHeader = ''
		}

	}

	Delete(signId) {
		this.dialog.open(ConfirmationDialogComponent, {
			panelClass: ['confirmation-dialog'],
			data: { headermsg: 'Are you sure you want To delete this signature?' }
		}).afterClosed().subscribe(data => {
			if (data == 'ok') {
				this._ticketService.DeleteSignatures(signId).subscribe(res => {
					if (res.status == "ok") {
						this.snackBar.openFromComponent(ToastNotifications, {
							data: {
								img: 'ok',
								msg: 'Signature deleted successfully!'
							},
							duration: 2000,
							panelClass: ['user-alert', 'success']
						});
					}
				});
			}
		});
	}

	Edit(signId) {
		this.update = true;
		this.showSignatureForm = true;

		let index = this.signList.findIndex(x => x._id == signId);
		this.signatureHeader = this.signList[index].header;
		this.signatureFooter = this.signList[index].footer;
		this.id = this.signList[index]._id;
	}

	popperOnClick(data) {
		setTimeout(() => {
			this.signList.forEach(element => {
				if (element._id == data._id) {
					if (element.header) {
						let headerCode = data.header;
						this.previewTemplateHeader = this.sanitized.bypassSecurityTrustHtml(headerCode);
					}
					if (element.footer) {
						let footerCode = data.footer;
						this.previewTemplateFooter = this.sanitized.bypassSecurityTrustHtml(footerCode);
					}
				}
			});
		}, 0);
	}

	ClosePopper() {
		this.previewPopper.hide();
	}
	ngOnDestroy() {
		this.subscriptions.map(subscription => {
			subscription.unsubscribe();
		});
	}
}
