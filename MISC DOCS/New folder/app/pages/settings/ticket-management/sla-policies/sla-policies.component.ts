import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import { SLAPoliciesService } from '../../../../../services/LocalServices/SLAPoliciesService';
import { Subscription } from 'rxjs/Subscription';
import { ToastNotifications } from '../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../../services/AuthenticationService';

@Component({
	selector: 'app-sla-policies',
	templateUrl: './sla-policies.component.html',
	styleUrls: ['./sla-policies.component.css'],
	encapsulation: ViewEncapsulation.None,
})
export class SlaPoliciesComponent implements OnInit {
	nsp = '';
	email = '';
	addPolicy = false;
	reOrderEnable = false;
	selectedPolicy = undefined;
	policyObject = undefined;
	allSLAPolicies = [];
	subscriptions: Subscription[] = [];
	changeInReorder = false;
	package: any;
	constructor(private _authService: AuthService, private _appStateService: GlobalStateService, private _slaPolicyService: SLAPoliciesService, public snackBar: MatSnackBar) {
		this.subscriptions.push(_authService.getPackageInfo().subscribe(pkg => {

			if (pkg) {
				this.package = pkg.tickets.SLA;
				if (!this.package.allowed) {
					this._appStateService.NavigateTo('/noaccess');
				}
			}

		}));

		this.nsp = this._slaPolicyService.Agent.nsp;
		this.email = this._slaPolicyService.Agent.email;

		this.policyObject = {
			nsp: '',
			policyName: '',
			policyDesc: '',
			policyTarget: [
				{
					priority: 'Urgent',
					responseTimeKey: '15',
					responseTimeVal: 'mins',
					resolvedTimeKey: '15',
					resolvedTimeVal: 'mins',
					hours: 'operationalHours',
					emailActivationEscalation: true,
					emailActivationReminder: true
				},
				{
					priority: 'High',
					responseTimeKey: '15',
					responseTimeVal: 'mins',
					resolvedTimeKey: '15',
					resolvedTimeVal: 'mins',
					hours: 'operationalHours',
					emailActivationEscalation: true,
					emailActivationReminder: true
				},
				{
					priority: 'Medium',
					responseTimeKey: '15',
					responseTimeVal: 'mins',
					resolvedTimeKey: '15',
					resolvedTimeVal: 'mins',
					hours: 'operationalHours',
					emailActivationEscalation: true,
					emailActivationReminder: true
				},
				{
					priority: 'Low',
					responseTimeKey: '15',
					responseTimeVal: 'mins',
					resolvedTimeKey: '15',
					resolvedTimeVal: 'mins',
					hours: 'operationalHours',
					emailActivationEscalation: true,
					emailActivationReminder: true
				}],
			policyApplyTo: [{ name: '', value: [] }],
			reminderResponse: [{ type: 'response', responsetimeKey: '15', responsetimeVal: 'mins', emails: [], notifyTo: ['Assigned Agent'] }],
			reminderResolution: [{ type: 'resolution', resolvedtimeKey: '15', resolvedtimeVal: 'mins', emails: [], notifyTo: ['Assigned Agent'] }],
			violationResponse: [{ type: 'response', duration: '', emails: [], notifyTo: ['Assigned Agent'] }],
			violationResolution: [{ type: 'resolution', duration: '', emails: [], notifyTo: ['Assigned Agent'] }],

			activated: false,
			created: { date: new Date().toISOString(), by: this.email },
			lastModified: { date: '', by: '' },
		};

		this._appStateService.contentInfo.next('');
		this._appStateService.breadCrumbTitle.next('Ticket Management');

		this.subscriptions.push(this._slaPolicyService.AddSLAPolicy.subscribe(data => {
			this.addPolicy = data;
		}));

		this.subscriptions.push(this._slaPolicyService.changeInReorder.subscribe(data => {
			if (data) {
				this.changeInReorder = data;
			}
		}));

		this.subscriptions.push(this._slaPolicyService.selectedSLAPolicy.subscribe(data => {
			this.selectedPolicy = data;

		}));

		this.subscriptions.push(this._slaPolicyService.reOrderPolicy.subscribe(data => {
			this.reOrderEnable = data;

		}));

		this.subscriptions.push(this._slaPolicyService.AllSLAPolicies.subscribe(data => {
			if (data && data.length) {
				this.allSLAPolicies = data;
			}
			else {
				this.allSLAPolicies = [];
			}
		}));
	}

	ngOnInit() {
	}

	SaveReorder() {
		this.snackBar.openFromComponent(ToastNotifications, {
			data: {
				img: 'ok',
				msg: 'Policies reordered successfully!'
			},
			duration: 2000,
			panelClass: ['user-alert', 'success']
		});
		this._slaPolicyService.reOrderPolicy.next(false);
	}
	CancelReorder() {
		this._slaPolicyService.reOrderPolicy.next(false);
	}
	ReorderSLAPolicy() {
		this._slaPolicyService.reOrderPolicy.next(true);
	}
	AddSLAPolicy() {
		this._slaPolicyService.reOrderPolicy.next(false);
		this._slaPolicyService.AddSLAPolicy.next(true);
		this._slaPolicyService.selectedSLAPolicy.next(undefined);
	}
	ngOnDestroy() {
		this.subscriptions.map(subscription => {
			subscription.unsubscribe();
		});
	}


}
