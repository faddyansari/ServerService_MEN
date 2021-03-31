import { UtilityService } from './../../../services/UtilityServices/UtilityService';
import { TicketsService } from './../../../services/TicketsService';
import { TicketAutomationService } from './../../../services/LocalServices/TicketAutomationService';
import { TicketTemplateSevice } from './../../../services/LocalServices/TicketTemplateService';
import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { SocketService } from '../../../services/SocketService';
import { AuthService } from '../../../services/AuthenticationService';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FormDesignerService } from '../../../services/LocalServices/FormDesignerService';
import { PopperContent } from 'ngx-popper';

@Component({
    selector: 'app-add-ticket-dialog',
    templateUrl: './add-ticket-dialog.component.html',
    styleUrls: ['./add-ticket-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddTicketDialogComponent {
    @ViewChild('templatePopper') templatePopper: PopperContent

    public http: any;
    public subscriptions: Subscription[] = [];
    public groupsList = [];
    selectedTags = [];
    watch_agents = [];
    selectedWatchers = [];
    selectedAgent = [];
    public agent: any;
    public socket: SocketIOClient.Socket;
    emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    numberRegex = /^([^0-9]*)$/;
    SpecialChar = /^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/;
    whiteSpace = /^[^\s]+(\s+[^\s]+)*$/;
    tagPattern = /^[ \t]*#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z])[ \t]*((,)?#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z]))*$/;

    public loading = false;

    public addTicketForm: FormGroup;

    public submitted = false;
    cannedForms = [];
    ticketTemplates = [];
    groups = [];
    all_agents = [];
    OriginalAgents = [];
    endedWatchers = false;
    loadingMoreAgentsWatchers = false;

    ended = false;
    loadingMoreAgents = false;

    constructor(public _authService: AuthService, _socketService: SocketService,
        private formbuilder: FormBuilder,
        private _ticketService: TicketsService,
        private _utilityService: UtilityService,
        private _formDesignerService: FormDesignerService,
        private _ticketTemplateService: TicketTemplateSevice,
        private _ticketAutosvc: TicketAutomationService,
        private dialogRef: MatDialogRef<AddTicketDialogComponent>) {
        this.addTicketForm = formbuilder.group({
            'subject': [null, [Validators.required, Validators.pattern(this.whiteSpace)]],
            'state': ['', Validators.required],
            'priority': ['', Validators.required],
            'cannedForm': [''],
            'assigned_to': ['', []],
            'group': ['', []],
            'tags': [[], []],
            'watchers': [[], []],


            'visitor': formbuilder.group({
                'name': [null, [Validators.required, Validators.pattern(this.numberRegex), Validators.pattern(this.SpecialChar)]],
                'email': [null,
                    [
                        Validators.pattern(this.emailPattern),
                        Validators.required
                    ]
                ],
                'message': ['Hello!'],
            })
        });

        this.subscriptions.push(_socketService.getSocket().subscribe(data => this.socket = data));
        this.subscriptions.push(_authService.getAgent().subscribe(agent => {
            this.agent = agent;
        }));

        this.subscriptions.push(this._ticketAutosvc.Groups.subscribe(data => {
            if (data && data.length) {
                this.groups = data;
            }
        }));

        this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(data => {
            if (data) {
                this.all_agents = data;
                this.watch_agents = data;
                this.OriginalAgents = data;
            }
        }));

        this.subscriptions.push(this._formDesignerService.WholeForm.subscribe(data => {
            if (data && data.length) this.cannedForms = data
        }));

        /**
         * To check if template is allowed to be in list or not?
         */
        this.subscriptions.push(this._ticketTemplateService.AllTemplates.subscribe(data => {
            if (data && data.length) {
                let agents = [];
                data.map(res => {
                    if (res.availableFor == "allagents") {
                        this.ticketTemplates.push(res)
                    }
                    else {
                        //see for agent in group from groups defined in groupNames..
                        let filteredagent = this.groups.filter(g => res.groupName.includes(g.group_name)).map(g => g.agent_list);
                        filteredagent.map(g => {
                            g.map(agent => {
                                if (agent.email == this.agent.email) {
                                    agents.push(agent.email);
                                }
                            });
                        });
                        if (agents && agents.length) {
                            this.ticketTemplates.push(res);
                        }
                    }

                })
            }

        }));
    }

    //ASSIGNED_TO
    loadMoreAssignAgent(value) {
        if (!this.ended && !this.loadingMoreAgents && !this.selectedAgent.length) {
            //console.log('Fetch More');
            this.loadingMoreAgents = true;
            this._utilityService.getMoreAgentsObs(this.all_agents[this.all_agents.length - 1].first_name).subscribe(response => {
                //console.log(response);
                this.all_agents = this.all_agents.concat(response.agents);
                this.ended = response.ended;
                this.loadingMoreAgents = false;
            });
        }
    }
    onSearchAssignAgent(value) {
        console.log('Search');
        if (value) {
            if (!this.selectedAgent.length) {
                let agents = this.all_agents.filter(a => a.email.includes((value as string).toLowerCase()));
                this._utilityService.SearchAgent(value).subscribe((response) => {
                    //console.log(response);
                    if (response && response.agentList.length) {
                        response.agentList.forEach(element => {
                            if (!agents.filter(a => a.email == element.email).length) {
                                agents.push(element);
                            }
                        });
                    }
                    this.all_agents = agents;
                });
            } else {
                let agents = this.all_agents.filter(a => a.email.includes((value as string).toLowerCase()));
                this.all_agents = agents;
            }
            // this.agentList = agents;
        } else {
            this.all_agents = this.OriginalAgents;
            this.ended = false;
            // this.setScrollEvent();
        }
    }
    onDeSelectAssignAgent(value) {
        this.selectedAgent = value;
    }

    //WATCHERS
    loadMoreWatchers(event) {
        if (!this.endedWatchers && !this.loadingMoreAgentsWatchers && !this.selectedWatchers.length) {
            //console.log('Fetch More');
            this.loadingMoreAgentsWatchers = true;
            this._utilityService.getMoreAgentsObs(this.watch_agents[this.watch_agents.length - 1].first_name).subscribe(response => {
                //console.log(response);
                this.watch_agents = this.watch_agents.concat(response.agents);
                this.endedWatchers = response.ended;
                this.loadingMoreAgentsWatchers = false;
            });
        }
    }
    onSearchWatchers(value) {
        console.log('Search');
        if (value) {
            if (!this.selectedWatchers.length) {
                let agents = this.watch_agents.filter(a => a.email.includes((value as string).toLowerCase()));
                this._utilityService.SearchAgent(value).subscribe((response) => {
                    //console.log(response);
                    if (response && response.agentList.length) {
                        response.agentList.forEach(element => {
                            if (!agents.filter(a => a.email == element.email).length) {
                                agents.push(element);
                            }
                        });
                    }
                    this.watch_agents = agents;
                });
            } else {
                let agents = this.watch_agents.filter(a => a.email.includes((value as string).toLowerCase()));
                this.watch_agents = agents;
            }
            // this.agentList = agents;
        } else {
            this.watch_agents = this.OriginalAgents;
            this.endedWatchers = false;
            // this.setScrollEvent();
        }
    }
    onDeSelect(event) {
        this.selectedWatchers = event;
    }


    public noWhitespaceValidator(control: FormControl) {
        const isWhitespace = (control.value || '').trim().length === 0;
        const isValid = !isWhitespace;
        return isValid ? null : { 'whitespace': true };
    }

    GetAvailableAgents() {
        if (this.addTicketForm.get('group').value) {

            this._ticketService.getAgentsAgainstGroup([this.addTicketForm.get('group').value]).subscribe(agents => {
                if (agents && agents.length) {
                    this.addTicketForm.get('assigned_to').setValue('')
                    this.selectedAgent = [];
                    this.all_agents = agents;
                }
                else {
                    this.all_agents = []
                }
            });
        } else {
            this._utilityService.getAllAgentsListObs().subscribe(agents => {
                this.all_agents = agents;
            });
        }
    }

    submitForm() {
        if (this.addTicketForm.valid) {
            //OLD ONE
            // let details = {
            //     message: {
            //         from: this.agent.email,
            //         to: this.addTicketForm.get('visitor').get('email').value,
            //         body: this.addTicketForm.get('visitor').get('message').value,

            //     },
            //     thread: {
            //         subject: this.addTicketForm.get('subject').value.trim(),
            //         state: this.addTicketForm.get('state').value,
            //         priority: this.addTicketForm.get('priority').value,
            //         visitor: {
            //             name: this.addTicketForm.get('visitor').get('name').value,
            //             email: this.addTicketForm.get('visitor').get('email').value,
            //         }
            //     },
            //     // form: {
            //     //     id: this.addTicketForm.get('cannedForm').value ? this.addTicketForm.get('cannedForm').value : '',
            //     //     type: 'cannedForm'
            //     // },
            //     // submittedForm: (this.addTicketForm.get('cannedForm').value) ? this.cannedForms.filter(data => data._id == this.addTicketForm.get('cannedForm').value) : []

            // }

            //TEMPLATE TICKET ->NEW
            let details = {
                message: {
                    from: this.agent.email,
                    to: this.addTicketForm.get('visitor').get('email').value,
                    body: this.addTicketForm.get('visitor').get('message').value,

                },
                thread: {
                    subject: this.addTicketForm.get('subject').value.trim(),
                    state: this.addTicketForm.get('state').value,
                    priority: this.addTicketForm.get('priority').value,
                    group: this.addTicketForm.get('group').value ? this.addTicketForm.get('group').value : '',
                    assigned_to: this.addTicketForm.get('assigned_to').value ? this.addTicketForm.get('assigned_to').value : '',
                    tags: this.addTicketForm.get('tags').value ? this.addTicketForm.get('tags').value : [],
                    watchers: this.addTicketForm.get('watchers').value ? this.addTicketForm.get('watchers').value : [],

                    visitor: {
                        name: this.addTicketForm.get('visitor').get('name').value,
                        email: this.addTicketForm.get('visitor').get('email').value,
                    },
                    // cannedForm: {
                    //     id: this.addTicketForm.get('cannedForm').value ? this.addTicketForm.get('cannedForm').value : undefined,
                    //     type: 'cannedForm'
                    // }
                }
            }

            this.dialogRef.close(details);

        }
    }

    Close(event: Event) {
        this.dialogRef.close();
    }

    AutoFillTemplate(name) {
        let template: any = {};
        this.ticketTemplates.map(temp => {
            if (temp.templateName == name) {
                template = temp;
            }
        });
        if (template.group && !template.agent.email) {
            this._ticketService.getAgentsAgainstGroup([template.group]).subscribe(agents => {
                if (agents && agents.length) {
                    this.addTicketForm.get('assigned_to').setValue('')
                    this.all_agents = agents;

                }
                else {
                    this.all_agents = []
                }
            });
        } else {
            this._utilityService.getAllAgentsListObs().subscribe(agents => {
                this.all_agents = agents;
            });
        }

        this.addTicketForm.get('subject').setValue(template.subject);
        this.addTicketForm.get('priority').setValue(template.priority.toUpperCase());
        this.addTicketForm.get('state').setValue(template.status.toUpperCase());
        this.addTicketForm.get('visitor').get('message').setValue(template.message ? template.message : '');
        this.addTicketForm.get('group').setValue(template.group ? template.group : '');
        this.addTicketForm.get('assigned_to').setValue(template.agent ? template.agent.email : '');
        this.addTicketForm.get('tags').setValue(template.tags ? template.tags : []);
        this.addTicketForm.get('watchers').setValue(template.watchers ? template.watchers : []);
        this.addTicketForm.get('cannedForm').setValue(template.cannedForm ? template.cannedForm : '')
        this.templatePopper.hide();
    }

    ngOnDestroy() {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }
}