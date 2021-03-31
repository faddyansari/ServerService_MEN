import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs/Subscription';
import { RolesAndPermissionsService } from '../../../services/RolesAndPermissionsService';
import { AgentService } from '../../../services/AgentService';
import { AuthService } from '../../../services/AuthenticationService';

@Component({
	selector: 'app-new-role-dialog',
	templateUrl: './new-role-dialog.component.html',
	styleUrls: ['./new-role-dialog.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class NewRoleDialogComponent implements OnInit {
	subscriptions : Subscription[] = [];
	agentList = [];
	roles = [];
	deletionRole = '';
	errorMsg = '';
	loading = false;
	userPermissions : any;
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _roleService : RolesAndPermissionsService,
		private _agentService : AgentService,
		private _authService : AuthService,
		private dialogRef: MatDialogRef<NewRoleDialogComponent>
	) {
		this.agentList = data.agents;
		this.deletionRole = data.deletionRole;

		this.subscriptions.push(this._roleService.roles.subscribe(roles => {
			this.roles = roles;
		}));
		this.subscriptions.push(_authService.getSettings().subscribe(data => {
			this.userPermissions = data.permissions.settings;
			// console.log(this.userPermissions);
			
		}));	
	}

	ngOnInit() {

	}

	save(){
		if(this.userPermissions.rolesAndPermissions.canDeleteRole){

			this.loading = true;
			this.agentList.map(a => {
				if(a.role == this.deletionRole){
					a.showError = true;
				}else{
					a.showError = false;
				}
				return a;
			});
			if(this.agentList.filter(a => a.showError).length){
				this.errorMsg = 'Please select a different role as this role is going to be deleted.'
				this.loading = false;
			}else{
				// console.log('Else');
				this.errorMsg = '';
				this._agentService.AssignNewRolesToUsers(this.agentList).subscribe(response => {
					if(response == 'ok'){
						this.dialogRef.close({
							status:true 
						});
					}else{
						this.errorMsg = 'Error!'
					}
					this.loading = false;
				}, err => {
					this.loading = false;
				})
				// this.dialogRef.close({
	
				// })
				// console.log(this.agentList);
			}
		}else{
			this.errorMsg = 'Permissions revoked!'
		}
	}

	checkSelection(agent){
		if(agent.role != this.deletionRole){
			agent.showError = false;
		}else{
			agent.showError = true;
		}
	}

}
