import { Component, ViewChild, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
import { FormDesignerService } from '../../../../services/LocalServices/FormDesignerService';
import { Subscription } from 'rxjs/Subscription';
import { GlobalStateService } from '../../../../services/GlobalStateService';
import { AuthService } from '../../../../services/AuthenticationService';

@Component({
	selector: 'app-form-designer',
	templateUrl: './form-designer.component.html',
	styleUrls: ['./form-designer.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [
		FormDesignerService
	]
})
export class FormDesignerComponent implements OnInit {
	subscriptions: Subscription[] = [];
	addForm = true;
	editForm = true;
	SelectedForm = undefined;
	Agent = undefined
	public newObject = undefined;
	package: any;

	constructor(private _authService: AuthService,private _formDesignerService: FormDesignerService, private _appStateService: GlobalStateService) {

		this._appStateService.contentInfo.next('');
		this._appStateService.breadCrumbTitle.next('Ticket Management');

		this.subscriptions.push(_authService.getPackageInfo().subscribe(pkg => {

			if (pkg) {
                this.package = pkg.tickets.formDesigner;
                if(!this.package.allowed){
                    this._appStateService.NavigateTo('/noaccess');
                }
			}

		}));
		this.subscriptions.push(this._formDesignerService.AddForm.subscribe(value => {
			this.addForm = value;
		}));

		this.subscriptions.push(this._formDesignerService.selectedForm.subscribe(value => {
			this.SelectedForm = value;
		}));
		this.Agent = this._formDesignerService.Agent

		this.newObject = {
			nsp: '',
			formFooter: '',
			formHeader: '',
			actionType: '',
			actionUrl: '',
			formName: '',
			formHtml: '',
			formFields: [{
				type: 'text',
				id: "",
				fieldName: "",
				label: "",
				value: "",
				validation: false,
				placeholder: '',
				options: [{
					key: '',
					value: ''
				}],
			}],

			lastmodified: { date: new Date().toISOString(), by: '' },
		};

	}

	ngOnInit() {

	}
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
		//this._formDesignerService.Destroy();

	}

	public AddForm() {
		this._formDesignerService.AddForm.next(true);
	}

}

