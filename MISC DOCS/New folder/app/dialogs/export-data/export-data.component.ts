import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { TicketsService } from '../../../services/TicketsService';
import { Subscription } from 'rxjs/Subscription';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { ToastNotifications } from '../SnackBar-Dialog/toast-notifications.component';
import { AuthService } from '../../../services/AuthenticationService';
import { TeamService } from '../../../services/LocalServices/TeamService';

@Component({
	selector: 'app-export-data',
	templateUrl: './export-data.component.html',
	styleUrls: ['./export-data.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [
		TeamService
	]
})
export class ExportDataComponent implements OnInit {

	private subscriptions: Subscription[] = [];
	public exportForm: FormGroup;
	public loading = false;
	submitError = true;
	daysdata = [];
	actualKeys = [];
	teams = [];
	emails = [];
	flag = false;
	toggle = false;
	dynamicFields: any;
	emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	orders = [
		{ actual: 'clientID', genre: 'Ticket ID' },
		{ actual: 'datetime', genre: 'Created Date' },
		{ actual: 'lasttouchedTime', genre: 'Last Updated' },
		{ actual: 'from', genre: 'From' },
		{ actual: 'source', genre: 'Source' },
		{ actual: 'subject', genre: 'Subject' },
		{ actual: 'group', genre: 'Group' },
		{ actual: 'assigned_to', genre: 'Assigned Agent' },
		{ actual: 'state', genre: 'State' },
		{ actual: 'mergedTicketIds', genre: 'Merged IDs' },
		{ actual: 'references', genre: 'References' },
		{ actual: 'tags', genre: 'Tags' },
		{ actual: 'ticketlog', genre: 'Logs' },
		{ actual: 'teams', genre: 'Teams' },
	];

	dates: any;

	constructor(
		private _authService: AuthService,
		private _ticketService: TicketsService,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private formBuilder: FormBuilder,
		private teamService: TeamService,
		private dialogRef: MatDialogRef<ExportDataComponent>,
		public snackBar: MatSnackBar
	) {
		// if(data.length){
		// 	let keys = [];
		// 	data.map(d => {
		// 		Object.keys(d).map(key => {
		// 			if(typeof d[key] == 'object' && !Array.isArray(d[key])){
		// 				Object.keys(d[key]).map(nested => {
		// 					if(!keys.includes(key + '.' + nested)){
		// 						keys.push(key + '.' + nested);
		// 					}
		// 				})
		// 			}else{
		// 				if(!keys.includes(key)){
		// 					keys.push(key);
		// 				}
		// 			}
		// 		})
		// 	});
		// 	// console.log(keys);

		// }
		// this.exportForm = formBuilder.group({
		//   'format': ['EXCEL', Validators.required],
		//   'properties': [true, Validators.required]
		// });
		const formControls = this.orders.map(control => new FormControl(false));
		const selectAllControl = new FormControl(false);
		this.exportForm = this.formBuilder.group({
			'orders': new FormArray(formControls),
			'format': ['EXCEL', Validators.required],
			selectAll: selectAllControl
		});

		this.subscriptions.push(this._authService.getSettings().subscribe(settings => {
			if (settings) {
				this.dynamicFields = settings.schemas.ticket.fields;
				if (this.dynamicFields.length) {
					this.dynamicFields = this.dynamicFields.filter(d => !d.default);
					// console.log(this.dynamicFields);
					this.dynamicFields.forEach(element => {
						this.orders.push({
							actual: 'dynamicFields.' + element.name,
							genre: element.label
						});
						// console.log(this.exportForm.get('orders'));

						let expForm = this.exportForm.get('orders') as FormArray;
						expForm.push(new FormControl(false));
					});
					// console.log(this.orders);

				}

			}
		}));
		this.subscriptions.push(this.teamService.Teams.subscribe(value => {
			this.teams = value;
		}))
	}

	ngOnInit() {
	}

	dateChanged(event) {
		if (event.status) {
			this.dates = event.dates;
		} else {
			this.dates = undefined;
		}
	}

	onChanges(name) {
		switch (name) {
			case 'selectAll':
				this.exportForm
					.get('orders')
					.patchValue(Array(this.orders.length).fill(this.exportForm.get('selectAll').value));
				break;
			case 'custom':
				this.exportForm.get('orders').valueChanges.subscribe(val => {
					this.exportForm.get('selectAll').setValue(val.every(bool => bool));
				});
				break;
		}

	}



	submit() {
		//console.log(exportDays);
		if (!this.data.length) {
			let attributes = this.exportForm.value.orders.map((checked, index) => checked ? this.orders[index].genre : null).filter(value => value !== null);
			this.orders.map(a => {
				attributes.filter(b => {
					if (a.genre == b) {
						this.actualKeys.push({
							label: a.genre,
							actual: a.actual
						})
					}
				})
			})
			
			if (this.actualKeys.length && attributes && this.emails.length) {
				this._ticketService.exportDays(this.dates.from, this.dates.to, this.actualKeys, this.emails).subscribe(res => {
					// console.log(res);
					if (res.status == "ok") {
						//console.log(res.det);
						this.snackBar.openFromComponent(ToastNotifications, {
							data: {
								img: 'ok',
								msg: 'Success! you will get a download link on your email in a while..'
							},
							duration: 2000,
							panelClass: ['user-alert', 'success']
						});
						this.dialogRef.close({
							status: true
						});
					}
				});
			} else {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'warning',
						msg: 'Please make sure all fields are filled!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'error']
				});


			}
		}
		else {
			let formatSelected = this.exportForm.get('format').value;

			const selectedAttributes = this.exportForm.value.orders
				.map((checked, index) => checked ? this.orders[index].genre : null)
				.filter(value => value !== null)

			this.orders.map(a => {
				selectedAttributes.filter(b => {
					if (a.genre == b) {
						this.actualKeys.push({
							label: a.genre,
							actual: a.actual
						})

					}
				})
			})

			let transformedArray = [];

			this.data.map(element => {
				let obj = {};
				// //console.log(element);
				this.actualKeys.map(key => {
					let check = key.actual.split('.');
					if (check[0] == 'dynamicFields') {
						Object.assign(obj, { [key.label]: (element[check[0]] && element[check[0]][check[1]]) ? ((Array.isArray(element[check[0]][check[1]])) ? JSON.stringify(element[check[0]][check[1]]) : element[check[0]][check[1]]) : 'N/A' });
					} else {
						if (key.actual == 'datetime' || key.actual == 'lasttouchedTime') {
							Object.assign(obj, { [key.label]: new Date(element[key.actual]).toLocaleString() });
						}
						else if (key.actual == 'teams') {
							// console.log('Teams');
							if (element.assigned_to) {
								// let teams : any = [];
								// console.log(this.teams);
								// console.log(element.assigned_to);
								let agentTeams = this.teams.filter(t => t.agents.findIndex(a => a.email == element.assigned_to) != -1);
								// console.log(agentTeams);							
								Object.assign(obj, { teams: agentTeams.map(a =>a.team_name).join() });
								// this.teamService.getTeamsAgainsAgent(element.assigned_to).subscribe(response => {
								// 	Object.assign(obj, { teams: response.join() });
								// });
							} else {
								Object.assign(obj, { teams: '' });
							}
						}
						else {
							// console.log(key.actual);
							// console.log(element[key.actual]);

							Object.assign(obj, { [key.label]: (element[key.actual]) ? ((Array.isArray(element[key.actual])) ? JSON.stringify(element[key.actual]) : element[key.actual]) : 'N/A' });
						}
					}
				});

				if (Object.keys(obj).length) {
					transformedArray.push(obj);
				}

			})

			//console.log(transformedArray);

			if (!transformedArray.length && formatSelected == 'EXCEL') {
				alert("No option selected!")
			}
			else {
				// this._ticketService.ExportToExcel(transformedArray, 'Ticket_Data');
				this.flag = true;
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'ok',
						msg: 'Data exported successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				});
			}

			if (this.flag) {
				this.dialogRef.close({
					status: true
				});
			}
		}

	}
}


