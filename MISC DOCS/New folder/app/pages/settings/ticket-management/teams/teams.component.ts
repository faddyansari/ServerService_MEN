import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import { AuthService } from '../../../../../services/AuthenticationService';
import { TeamService } from '../../../../../services/LocalServices/TeamService';
import { ConfirmationDialogComponent } from '../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UtilityService } from '../../../../../services/UtilityServices/UtilityService';
import { l } from '@angular/core/src/render3';

@Component({
	selector: 'app-teams',
	templateUrl: './teams.component.html',
	styleUrls: ['./teams.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TeamsComponent implements OnInit {

	subscriptions: Subscription[] = [];
	Teams: any;
	Agent: any;
	showForm: boolean = false;
	showAddAgentForm: boolean = false;
	addTeamForm: FormGroup;
	editTeamForm: FormGroup;
	editForm = false;
	agentList: any = [];
    agentList_original: any = [];
	selectedAgents = [];
	selectedTeam : any;
	ended = false;
	isAgentSelected = false;
	searchValue = '';
	permissions: any;
	teamPermissions: any;
	package: any;
	constructor(private _authService: AuthService,
				private _appStateService: GlobalStateService,
				private formbuilder: FormBuilder,
				private _utilityService: UtilityService,
				private _teamService: TeamService,
				public dialog: MatDialog) { 
		this._appStateService.contentInfo.next('');
		this._appStateService.breadCrumbTitle.next('Ticket Management');
		
		this.subscriptions.push(_authService.getPackageInfo().subscribe(pkg => {

			if (pkg) {
                this.package = pkg.tickets.team;
                if(!this.package.allowed){
                    this._appStateService.NavigateTo('/noaccess');
                }
			}

		}));

        this.subscriptions.push(_authService.getSettings().subscribe(data => {

			if (data && data.permissions) {
				this.permissions = data.permissions.tickets;
				this.teamPermissions = data.permissions.settings.ticketManagement.teamManagement;
				
			}

		}));

		this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(data => {
            // console.log(data);
            if (data) {
                this.agentList = data;
                this.agentList_original = data;
            }
        }));

        this.subscriptions.push(_teamService.Teams.subscribe(data => {
			this.Teams = data;
		}));
        this.subscriptions.push(_teamService.selectedTeam.subscribe(data => {
			this.selectedTeam = data;
			// console.log(this.selectedTeam);
			
		}));
		this.addTeamForm = this.formbuilder.group({
            'team_name': [null, Validators.required],
            'desc': [null, Validators.required]
		});
		this.editTeamForm = this.formbuilder.group({
            '_id': [{value: null, disabled: true}, Validators.required],
            'team_name': [null, Validators.required],
            'desc': [null, Validators.required]
		});
		this.subscriptions.push(this._authService.getAgent().subscribe(agent => {
            if (agent) {
                this.Agent = agent;
                // console.log(this.Agent);

            }
        }));
	}

	ngOnInit() {
	}

	insertTeam(){
		if(!this.Teams.filter(t => t.team_name == this.addTeamForm.get('team_name').value).length){
			this._teamService.insertTeam(this.addTeamForm.value).subscribe(response => {
				// console.log(response);	
				if(response.status == 'ok'){
					this.showForm = false;
					this.addTeamForm.reset();
				}
			});
		}else{
			console.log('A team with this name already exists!');		
		}
	}

	deleteTeam(event,id){
		event.stopPropagation();
		event.stopImmediatePropagation();
		this._teamService.deleteTeam(id).subscribe(response => {
			// console.log(response);	
			if(this.selectedTeam && this.selectedTeam._id == id){
				// this.selectedTeam = undefined;
				this.showAddAgentForm = false;
			}
		});
	}

	updateTeam(id){
		if(!this.Teams.filter(t => t.team_name == this.addTeamForm.get('team_name').value).length){

		}
	}

	setSelectedTeam(id){
		// console.log(this.Teams.length);
		
		this._teamService.setSelectedTeam(id);

	}

	AddAgents(){
		this._teamService.addAgentsForTeam(this.selectedTeam._id, this.selectedAgents).subscribe(response => {
			if(response.status == 'ok'){
				this.selectedAgents = [];
				this.showAddAgentForm = false;
			}
		});
	}

	isAllAgentsChecked(){
		if(this.selectedTeam.agents.length){
			return this.selectedTeam.agents.every(data => data.checked);
		}else return false
	}
	SelectAllAgents(event){
		this.selectedTeam.agents.map(agent => agent.checked = event.target.checked);
        if (this.selectedTeam.agents.every(data => data.checked)) {
            this.isAgentSelected = true;
        } else {
            this.isAgentSelected = false;
        }
	}

	toggleAgentSelect(email){
		this.selectedTeam.agents.map(agent => {
			if(agent.email == email){
				agent.checked = !agent.checked;
				return agent;
			}
		});
		if (this.selectedTeam.agents.filter(data => data.checked).length) {
            this.isAgentSelected = true;
        }else{
			this.isAgentSelected = false;
		} 
	}

	RemoveSelectedAgents(){
		console.log(this.selectedTeam.agents.filter(a => a.checked));
		this.dialog.open(ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: 'Are You Sure You Want To Unassign Selected Agents?' }
        }).afterClosed().subscribe(data => {
            if (data == 'ok') {
                //   console.log('Delete!');
                let deleteList = this.selectedTeam.agents.filter(agent => agent.checked);
                // console.log(deleteList);
                deleteList.map(agent => {
                    // console.log(agent.email);
                    this.removeAgent(agent.email);
                })
                this.isAgentSelected = false;
            }
        });		
	}

	removeAgent(email){
		if (this.selectedTeam) {
			this._teamService.removeAgentsForTeam(this.selectedTeam._id, email);
		}
	}

	toggleExclude(email, value){
		//    console.log(value);
		   
		   this._teamService.ToggleExclude(this.selectedTeam.team_name, email, value);
		}

	cancelRemoveAgent(){
		this.selectedTeam.agents.map(agent => agent.checked = false);
        this.isAgentSelected = false;
	}

	filteredTeams(){
        if(this.teamPermissions && this.teamPermissions.canView == 'all'){
            return this.Teams;
        }else if (this.teamPermissions && this.teamPermissions.canView == 'custom'){
            let filteredTeams = [];
            this.teamPermissions.teamViewList.forEach(t => {
                filteredTeams = filteredTeams.concat(this.Teams.filter(team => team.team_name == t));
            });
            return filteredTeams;
		}
		else if (this.teamPermissions && this.teamPermissions.canView == 'members'){
            let filteredTeams = [];
			filteredTeams = this.Teams.filter(team => team.agents.filter(a => a.email == this.Agent.email).length);
			return filteredTeams;
        }
		else{
            return this.Teams;
        }
	}
	
	checkVisibility(){
        if(this.selectedTeam){
            if(this.filteredTeams().filter(t => t.team_name == this.selectedTeam.team_name).length){
                return true
            }else{
                return false
            }
        }else{
            return false
        }
    }

	agentChecked() {
        let value = false;
        this.selectedTeam.agents.some(agent => {
            if (agent.checked) {
                return value = agent.checked
            }
        })
        this.isAgentSelected = value;
    }

	ShowForm() {
        this.showForm = !this.showForm;
	}
	ShowAddAgentForm(){
		this.showAddAgentForm = !this.showAddAgentForm;
	}

	//Edit
	editTeam(team){
		this.editTeamForm.get('_id').setValue(team._id);
		this.editTeamForm.get('team_name').setValue(team.team_name);
		this.editTeamForm.get('desc').setValue(team.desc);
		this.editForm = true; 
	}
	save(){
		// console.log(this.editTeamForm.get('_id').value);
		// console.log(this.editTeamForm.value);

		if(!this.Teams.filter(t => t.team_name.toLowerCase() == this.editTeamForm.get('team_name').value.toLowerCase() && t._id != this.editTeamForm.get('_id').value).length){
			this._teamService.editTeam(this.editTeamForm.get('_id').value, this.editTeamForm.value).subscribe(status => {
				if(status == 'ok'){
					this.editTeamForm.reset();
					this.editForm = false;
				}else{
					alert('Error!');
				}
			})
		}else{
			alert('Team name already exists!');
		}
	}
	cancel(){
		this.editTeamForm.reset();
		this.editForm = false;
	}

	//Custom select events
	loadMore($event) {
        console.log('Scroll');
        if (!this.ended) {
            console.log('Fetch More');
            this._utilityService.getMoreAgentsObs(this.agentList[this.agentList.length - 1].first_name).subscribe(response => {
                console.log(response);
                this.agentList = this.agentList.concat(response.agents);
                this.ended = response.ended;
            });
        }
    }
	onSearch(value) {
		console.log('Search');
		console.log(value);
		if (value) {
			let agents = this.agentList_original.filter(a => a.email.includes((value as string).toLowerCase()));
				this._utilityService.SearchAgent(value).subscribe((response) => {
					//console.log(response);
					if (response && response.agentList.length) {
						response.agentList.forEach(element => {
							if (!agents.filter(a => a.email == element.email).length) {
								agents.push(element);
							}
						});
					}
					this.agentList = agents;
				});
			// this.agentList = agents;
		} else {
            this.agentList = this.agentList_original;
            this.ended = false;
			// this.setScrollEvent();
		}
	}


	ngOnDestroy(){
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		})
	}

}
