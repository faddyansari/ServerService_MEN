import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { TagService } from '../../../../../services/TagService';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TagsAutomationSettings } from '../../../../../services/LocalServices/TagsAutomationSettings';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastNotifications } from '../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { ConfirmationDialogComponent } from '../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TicketsService } from '../../../../../services/TicketsService';
import { TicketAutomationService } from '../../../../../services/LocalServices/TicketAutomationService';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { AuthService } from '../../../../../services/AuthenticationService';
import { UtilityService } from '../../../../../services/UtilityServices/UtilityService';
@Component({
    selector: 'app-tags',
    templateUrl: './tags.component.html',
    styleUrls: ['./tags.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TagsComponent implements OnInit, AfterViewInit {

    Tag: any;
    Group: any = [];
    Agent: any;
    subscriptions: Subscription[] = [];
    public addGroupForm: FormGroup;
    agentList: any;
    agentList_original: any;
    selectedAgents = [];
    dropdownSettings = {};
    edit = false;
    groupsAutomationSettings: any;
    showForm: boolean = false;
    selectedTag: any;
    selectedGroup: any;
    showAssignAgentForm: boolean = false;
    showTagKeywordsForm: boolean = false;
    showAgentForm = false;
    tag_keyword = '';
    agent_list = [];
    tag_keywords = [];
    enableDeleteForAgent: boolean = false;
    isAgentSelected: boolean = false;
    isKeywordSelected: boolean = false;
    enableDeleteForKeywords: boolean = false;
    pill1 = true;
    pill2 = false;
    route: any;
    ended = false;
    searchValue = '';
    permissions : any;
    groupPermissions: any;
    package: any;
    // pill2 = false;

    constructor(private _authService: AuthService,private formbuilder: FormBuilder, private _utilityService: UtilityService, private _tagService: TagService
        , private _groupsAutomationSettings: TagsAutomationSettings,
        private snackBar: MatSnackBar, public dialog: MatDialog, private _ticketService: TicketsService, private _ticketAutomationService: TicketAutomationService, private _appStateService: GlobalStateService) {
        // console.log('Groups Constructor');
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Ticket Management');

        this.subscriptions.push(_authService.getPackageInfo().subscribe(pkg => {

			if (pkg) {
                this.package = pkg.tickets.groups;
                if(!this.package.allowed){
                    this._appStateService.NavigateTo('/noaccess');
                }
			}

		}));
        this.subscriptions.push(_authService.getSettings().subscribe(data => {

			if (data && data.permissions) {
				this.permissions = data.permissions.tickets;
                this.groupPermissions = data.permissions.settings.ticketManagement.groupManagement;
			}

		}));

        this.addGroupForm = this.formbuilder.group({
            'group_name': [null, Validators.required],
            'desc': [null, Validators.required]
        });
        this.subscriptions.push(this._authService.getAgent().subscribe(agent => {
            if (agent) {
                this.Agent = agent;
                // console.log(this.Agent);

            }
        }));

        this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(data => {
            // console.log(data);
            if (data) {
                this.agentList = data;
                this.agentList_original = data;
            }
        }));
        this.subscriptions.push(this._appStateService.currentRoute.subscribe(data => {
            // console.log(data);
            this.route = data;

        }));

        // this.subscriptions.push(this._groupsAutomationSettings.groupsAutomationSettings.subscribe(data => {
        //     // console.log(data);
        //     if (data) {
        //         this.groupsAutomationSettings = data
        //         this.auto_assign = this.groupsAutomationSettings.auto_assign;
        //     }
        // }));

        // this.subscriptions.push(this._tagsAutomationSettings.auto_assign.subscribe(data=>{
        // 	this.auto_assign = data
        // }));

        this.subscriptions.push(this._ticketAutomationService.Groups.subscribe(data => {
            if (data) {
                // console.log(data);

                this.Group = data;
            }
        }));

        this.subscriptions.push(this._ticketAutomationService.selectedGroup.subscribe(data => {
            this.selectedGroup = data;
            // console.log(data);

            if (this.selectedGroup) {
                if (this.selectedGroup.agent_list && this.selectedGroup.agent_list.length) {
                    this.agent_list = this.selectedGroup.agent_list;

                } else {
                    this.agent_list = [];
                }
            }
            // console.log(this.selectedGroup);
        }));
    }

    ngOnInit() {

    }

    ngAfterViewInit() {


    }

    onItemSelect(item: any) {
        // console.log("Select", item);

        //Only insert tags if its distinct
        if (!this.selectedAgents.includes(item)) {
            this.selectedAgents.push(item);
        }
        // console.log(this.selectedAgents);

    }
    resetList() {
        this.agentList = this.agentList_original;
    }

    setSelectedGroup(group_name) {
        this._ticketAutomationService.setSelectedGroup(group_name);
        this.showAgentForm = false;
    }
    // SelectCurrentTag(tag: string) {
    //     this.selectedTag = tag;
    //     let data = this.Tag.tags.find(tag => tag.tag == this.selectedTag);
    //     // this.agent_list = data.agent_list;
    //     // let tagKeywords = data.tag_keywords;
    //     this.tag_keywords = [];
    //     if (tagKeywords) {
    //         tagKeywords.map(keyword => {
    //             let data: any = {
    //                 key: keyword
    //             }
    //             this.tag_keywords.push(data);
    //         });
    //     }
    //     // console.log(data);
    // }
    // onSelectAll(items: any) {
    //     //Empty the List before adding new tags on Select All
    //     this.selectedAgents = [];
    //     items.forEach(element => {
    //         if (!this.selectedAgents.includes(element)) {
    //             this.selectedAgents.push(element);
    //         }
    //     });
    //     // console.log(this.selectedAgents);

    // }
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
    setPillActive(pill) {
        switch (pill) {
            case 'pill1':
                this.pill1 = true;
                this.pill2 = false;
                break;
            case 'pill2':
                this.pill1 = false;
                this.pill2 = true;
                break;
        }
    }

    // onDeSelectAll(items: any) {
    //     this.selectedAgents = [];
    // }
    // onItemDeSelect(item: any) {
    //     // console.log("Deselect", item);

    //     //Remove the deselected item from the filter tag array
    //     const index: number = this.selectedAgents.indexOf(item);
    //     if (index !== -1) {
    //         this.selectedAgents.splice(index, 1);
    //     }
    //     // console.log(this.selectedAgents);

    // }

    insertGroup() {

        let group = {
            group_name: String(this.addGroupForm.get('group_name').value).trim(),
            group_desc: this.addGroupForm.get('desc').value,
            agent_list: [],
            auto_assign: {
                enabled: false,
                type: 'roundrobin'
            }
        }

        if (this.Group && this.Group.filter(data => data.group_name == group.group_name.toLowerCase()).length > 0) {
            // console.log("already exists");
            this.snackBar.openFromComponent(ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'Group Name already exists!'
                },
                duration: 3000,
                panelClass: ['user-alert', 'error']
            });
        }
        else {
            this._ticketAutomationService.insertGroup(group).subscribe(response => {
                if(response == 'ok'){
                    this.snackBar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Group added Successfully!'
                        },
                        duration: 3000,
                        panelClass: ['user-alert', 'success']
                    });
                    this.addGroupForm.controls['group_name'].setValue('');
                    this.addGroupForm.controls['desc'].setValue('');
                }else{
                    this.snackBar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: response
                        },
                        duration: 3000,
                        panelClass: ['user-alert', 'error']
                    });
                }     
            });
        }
    }

    StopPropagation(event: Event) {
        event.stopImmediatePropagation();
        event.stopPropagation();
    }

    deleteGroup(group_name: any) {
        // this._ticketService.getTicketsByGroup(group_name).subscribe(res=>{
        //     if(res.status =="ok"){
        //         console.log(res);
        //         if(res.data.group == group_name ){
        //             this.dialog.open(ConfirmationDialogComponent, {
        //                 panelClass: ['confirmation-dialog'],
        //                 data: { headermsg: 'Are You Sure You Want To Delete this Group? Deleting this group will move tickets assigned this group to Default group' }
        //             }).afterClosed().subscribe(data => {
        //                 if (data == 'ok') {
        //                     // this._ticketService.moveTicketsToDefault("default group");
        //                 }
        //             });
        //         }
        //     }

        // })
        this.dialog.open(ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: 'Are You Sure You Want To Delete?' }
        }).afterClosed().subscribe(data => {
            if (data == 'ok') {
                this._ticketAutomationService.deleteGroup(group_name);
                this.showAssignAgentForm = false;
                this.agent_list = [];
                // this.showTagKeywordsForm = false;
                // this.tag_keywords = [];
            }
        });
    }
    // deleteTag(tag_name: any) {
    //     this.dialog.open(ConfirmationDialogComponent, {
    //         panelClass: ['confirmation-dialog'],
    //         data: { headermsg: 'Are You Sure You Want To Delete?' }
    //     }).afterClosed().subscribe(data => {
    //         if (data == 'ok') {
    //             this._tagService.deleteTag(tag_name);
    //             this.selectedTag = '';
    //             this.showAssignAgentForm = false;
    //             this.agent_list = [];
    //             this.showTagKeywordsForm = false;
    //             this.tag_keywords = [];
    //         }
    //     });
    // }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

    SetAutoAssign(value: any) {
        this.selectedGroup.auto_assign.enabled = value;
        // console.log(this.auto_assign);
    }

    SaveAutoAssign() {
        this._ticketAutomationService.setAutoAssign(this.selectedGroup.group_name, this.selectedGroup.auto_assign);
    }

    // Agent UnAssign Work
    SelectAllAgents(event) {
        this.agent_list.map(agent => agent.checked = event.target.checked);
        if (this.agent_list.every(data => data.checked)) {
            this.isAgentSelected = true;
        } else {
            this.isAgentSelected = false;
        }
    }

    isAllAgentsChecked() {
        return this.agent_list.every(data => data.checked);
    }
    cancelAssignAgent() {
        this.agent_list.map(agent => agent.checked = false);
        this.isAgentSelected = false;
    }
    agentChecked() {
        let value = false;
        this.agent_list.some(agent => {
            if (agent.checked) {
                return value = agent.checked
            }
        })
        this.isAgentSelected = value;
    }
    UnAssignSelectedAgents() {
        this.dialog.open(ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: 'Are You Sure You Want To Unassign Selected Agents?' }
        }).afterClosed().subscribe(data => {
            if (data == 'ok') {
                //   console.log('Delete!');
                let deleteList = this.agent_list.filter(agent => agent.checked);
                // console.log(deleteList);
                deleteList.map(agent => {
                    // console.log(agent.email);
                    this.UnAssignAgent(agent.email);
                })
                this.isAgentSelected = false;
            }
        });
    }

    UnAssignAgent(email) {
        if (this.selectedGroup) {
            this._ticketAutomationService.unAssignAgent(email, this.selectedGroup.group_name);
        }
    }

    toggleAdmin(email, value){
    //    console.log(value);

       this._ticketAutomationService.ToggleAdmin(this.selectedGroup.group_name, email, value);
    }
    toggleExclude(email, value){
    //    console.log(value);
        // let turnCount = 0;
        // if(!value){
        //     let maxCounts = this.selectedGroup.agent_list.map(a =>a.turnCount);
        //     turnCount = Math.max(...maxCounts);
        //     if(turnCount != 0) turnCount = turnCount - 1;
        // }

        this._ticketAutomationService.ToggleExclude(this.selectedGroup.group_name, email, value);
    }

    // Agent UnAssign Work End

    AssignAgent() {
        // console.log("here");
        // console.log(this.selectedAgents);

        this.selectedAgents.forEach(agent => {
            if (this.agent_list && this.agent_list.filter(data => data.email == agent).length > 0) {

                this.snackBar.openFromComponent(ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: 'Selected agent already exists'
                    },
                    duration: 3000,
                    panelClass: ['user-alert', 'error']
                });
            } else {
                if (this.selectedGroup) {
                    // let maxCounts = this.selectedGroup.agent_list.map(a =>a.turnCount);
                    // let turnCount = Math.max(...maxCounts);
                    // if(turnCount != 0) turnCount = turnCount - 1;

                    this._ticketAutomationService.assignAgent(agent, this.selectedGroup.group_name);
                }

            }
        });
        this.selectedAgents = [];
    }

    filteredGroups(){
        if(this.groupPermissions && this.groupPermissions.canView == 'all'){
            return this.Group;
        }else if (this.groupPermissions && this.groupPermissions.canView == 'custom'){
            let filteredGroups = [];
            this.groupPermissions.groupViewList.forEach(g => {
                filteredGroups = filteredGroups.concat(this.Group.filter(group => group.group_name == g));
            });
            return filteredGroups;
        }
        else if (this.groupPermissions && this.groupPermissions.canView == 'admins'){
            let filteredGroups = [];
            filteredGroups = this.Group.filter(group => group.agent_list.filter(a => a.email == this.Agent.email && a.isAdmin).length);
            return filteredGroups;
        }
        else{
            return this.Group;
        }
    }

    checkVisibility(){
        if(this.selectedGroup){
            if(this.filteredGroups().filter(g => g.group_name == this.selectedGroup.group_name).length){
                return true
            }else{
                return false
            }
        }else{
            return false
        }
    }




    public ShowForm() {
        this.showForm = !this.showForm;
    }


    public ShowAssignAgentForm() {
        this.showAssignAgentForm = !this.showAssignAgentForm;
    }

    public addAgentForm() {
        this.showAgentForm = !this.showAgentForm;
    }
}