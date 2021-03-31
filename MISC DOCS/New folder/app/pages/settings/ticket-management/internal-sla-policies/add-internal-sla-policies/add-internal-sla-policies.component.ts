import { TicketsService } from './../../../../../../services/TicketsService';
import { TicketSecnarioAutomationService } from './../../../../../../services/LocalServices/TicketSecnarioAutomationService';
import { FormDesignerService } from './../../../../../../services/LocalServices/FormDesignerService';
import { UtilityService } from './../../../../../../services/UtilityServices/UtilityService';
import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { SLAPoliciesService } from '../../../../../../services/LocalServices/SLAPoliciesService';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ConfirmationDialogComponent } from '../../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { ToastNotifications } from '../../../../../dialogs/SnackBar-Dialog/toast-notifications.component';

@Component({
  selector: 'app-add-internal-sla-policies',
  templateUrl: './add-internal-sla-policies.component.html',
  styleUrls: ['./add-internal-sla-policies.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddInternalSlaPoliciesComponent implements OnInit {
  @Input() InternalPolicyObject: any;
  public agentsList = [];
  subscriptions: Subscription[] = [];
  Groups = [];
  groupList = [];
  allIntPolicies = [];
  selectedIntPolicy = undefined;
  all_agents = [];
  agent_original_list = [];
  cannedForms = [];
  all_agents_list = [];
  watchers_list = [];
  form_list = [];
  tagPattern = /^[ \t]*#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z])[ \t]*((,)?#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z]))*$/;
  // public srcList = [{ display: 'Live Chat', value: 'livechat' }, { display: 'Email', value: 'email' }, { display: 'Agent Panel', value: 'panel' }];
  // public stateList = [{ display: 'OPEN', value: 'OPEN' }, { display: 'PENDING', value: 'PENDING' }, { display: 'SOLVED', value: 'SOLVED' }];
  // public priorityList = [{ display: 'LOW', value: 'LOW' }, { display: 'MEDIUM', value: 'MEDIUM' }, { display: 'HIGH', value: 'HIGH' }, { display: 'URGENT', value: 'URGENT' }];
  PriorityList = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
  StateList = ['OPEN', 'PENDING', 'SOLVED'];
  public SrcList = ['LiveChat','Email', 'Panel'];

  Merge = ['True', 'False'];
  Viewstate = ['READ', 'UNREAD'];

  formChanges: any;
  Teams = [];
  teamsList = [];
  public InternalPolicyForm: FormGroup;
  nsp = '';
  email = '';
  setReminder = false;
  op = "";
  allscenarios = [];
  actualKeys = [];

  endedRem = false;
  loadingMoreAgentsRem = false;
  endedEsc = false;
  loadingMoreAgentsEsc = false;
  ended = false;
  loadingMoreAgents = false;

  selectedTags = [];
  selectedAgentRem = [];
  selectedAgentEsc = [];
  selectedAgent = [];
  selectedWatchers = [];

  violate = {
    '0_mins': 'Immediately',
    '30_mins': 'After 30 Minutes',
    '1_hour': 'After 1 hours',
    '2_hour': 'After 2 hours',
    '4_hour': 'After 4 hours',
    '8_hour': 'After 8 hours',
    '12_hour': 'After 12 hours',
    '1_week': 'After 1 week',
    '2_week': 'After 2 weeks',
    '1_day': 'After 1 day',
    '2_day': 'After 2 days',

  }
  public config: any = {
    placeholder: 'Add Note..',
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
  }
  constructor(private formbuilder: FormBuilder, private dialog: MatDialog, private _utilityService: UtilityService, public snackBar: MatSnackBar, private _slaPolicyService: SLAPoliciesService, private _formDesignerService: FormDesignerService, private _ticketScenarios: TicketSecnarioAutomationService, private _ticketService: TicketsService) {
    this.nsp = this._slaPolicyService.Agent.nsp;
    this.email = this._slaPolicyService.Agent.email;
    this.subscriptions.push(this._slaPolicyService.groupList.subscribe(data => {
      if (data) {
        this.Groups = data;
        // this.Groups.map(val => {
        //   this.groupList.push({ display: val.group_name, value: val.group_name })
        // })
      }
    }));
    this.subscriptions.push(this._ticketScenarios.AllScenarios.subscribe(data => {
      if (data && data.length) {
        this.allscenarios = data;
      }

    }));

    // this.subscriptions.push(this._slaPolicyService.teamsList.subscribe(data => {
    //   if (data) {

    //     this.Teams = data;
    //     this.Teams.map(val => {
    //       this.teamsList.push({ display: val.team_name, value: val.team_name.toLowerCase().replace(/\s/g, '') })
    //     })

    //   }
    // }));

    this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(agents => {
      this.all_agents = agents;
      this.watchers_list = agents;
      this.agent_original_list = agents;
    }));
    this.subscriptions.push(this._formDesignerService.WholeForm.subscribe(data => {
      if (data && data.length) {
        this.cannedForms = data
        // this.cannedForms.map(val => {
        //   this.form_list.push({ display: val.formName, value: val.formName })
        // })
      }
    }));

    this.subscriptions.push(this._slaPolicyService.AllInternalSLAPolicies.subscribe(data => {
      if (data && data.length) {
        this.allIntPolicies = data;
      }
      else {
        this.allIntPolicies = [];
      }
    }));


    this.subscriptions.push(this._slaPolicyService.selectedInternalSLAPolicy.subscribe(data => {
      if (data) {
        this.selectedIntPolicy = data;
        this.InternalPolicyObject = this.selectedIntPolicy;
        this.selectedIntPolicy.operations.map(act => {
          if (act.operationName == 'tags') {

            this.selectedTags = act.operationValue
          }
          if (act.operationName == 'watchers') {
            this.selectedWatchers = act.operationValue

          }
        })
        if (this.selectedIntPolicy.reminder.length) {
          this.setReminder = true;
        }
        else {
          this.setReminder = false;
        }
      }
      else {
        this.selectedIntPolicy = undefined;
      }
    }));

  }

  ngOnInit() {
    this.InternalPolicyForm = this.formbuilder.group({
      'policyName': [this.InternalPolicyObject.policyName,
      [
        Validators.required,
        Validators.minLength(2)
      ]],

      'policyDesc': [this.InternalPolicyObject.policyDesc,
      [
        Validators.minLength(2)
      ]],
      // 'orders':new FormArray(formControls),
      'policyApplyTo': this.formbuilder.array(this.TransformApplyTo(this.InternalPolicyObject.policyApplyTo), Validators.required),
      'operator': this.InternalPolicyObject.operator,
      'operations': this.formbuilder.array(this.TransformOperations(this.InternalPolicyObject.operations), Validators.required),
      'policyTarget': this.formbuilder.array(this.TransformPolicyTarget(this.InternalPolicyObject.policyTarget), Validators.required),
      'reminder': this.formbuilder.array(this.TransformReminder(this.InternalPolicyObject.reminder)),
      'escalation': this.formbuilder.array(this.TransformEscalation(this.InternalPolicyObject.escalation)),
    });
    this.onValueChanges();
  }

  onValueChanges() {
    this.InternalPolicyForm.valueChanges.subscribe(val => {
      this.formChanges = val;
    })
  }

  setSLAreminders() {
    this.setReminder = true;
  }
  AddAction() {
    let fb: FormGroup = this.formbuilder.group({
      operationName: [''],
      operationValue: [[]],
      regex: ['']

    })
    let actions = this.InternalPolicyForm.get('operations') as FormArray;
    actions.push(fb);
  }

  DeleteAction(index) {
    let actions = this.InternalPolicyForm.get('operations') as FormArray;
    actions.removeAt(index);
  }

  GetAvailableAgents(ev) {
    if (ev.target.value) {
      this._ticketService.getAgentsAgainstGroup([ev.target.value]).subscribe(agents => {
        if (agents && agents.length) {
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

  TransformApplyTo(applyTo?: Array<any>): FormGroup[] {
    let fb: FormGroup[] = [];
    applyTo.map(res => {
      fb.push(this.formbuilder.group({
        name: [res.name, Validators.required],
        value: [res.value, Validators.required]
      }));
    });
    return fb;
  }
  TransformPolicyTarget(target?: Array<any>): FormGroup[] {
    let fb: FormGroup[] = [];
    target.map(to => {
      fb.push(this.formbuilder.group({
        priority: [to.priority, Validators.required],
        TimeKey: [to.TimeKey, Validators.required],
        TimeVal: [to.TimeVal, Validators.required],
        emailActivationReminder: [to.emailActivationReminder, Validators.required],
        emailActivationEscalation: [to.emailActivationEscalation, Validators.required],
      }));
    });
    return fb;
  }
  TransformEscalation(escalation?: Array<any>): FormGroup[] {
    let fb: FormGroup[] = [];
    escalation.map(vio => {
      fb.push(this.formbuilder.group({
        duration: [vio.duration, Validators.required],
        emails: [vio.emails],
        notifyTo: [vio.notifyTo]
      }));
    });
    return fb;
  }
  TransformReminder(remind?: Array<any>): FormGroup[] {
    let fb: FormGroup[] = [];
    remind.map(rem => {
      fb.push(this.formbuilder.group({
        timeKey: [rem.timeKey],
        timeVal: [rem.timeVal],
        emails: [rem.emails],
        notifyTo: [rem.notifyTo]
      }));
    });
    return fb;
  }
  TransformOperations(operations?: Array<any>): FormGroup[] {
    let fb: FormGroup[] = [];
    operations.map(op => {
      fb.push(this.formbuilder.group({
        operationName: [op.operationName, Validators.required],
        operationValue: [op.operationValue, Validators.required],
        regex: [op.regex]
      }));
    });
    return fb;
  }
  GetAvailableActions(i) {
    let actionList = {
      'assigned_to': 'Assign To Agent',
      'group': 'Assign To Group',
      'null1': '------------------',
      'priority': 'Set Priority',
      'state': 'Set State',
      'viewState': 'Set ViewState',
      // 'snooze': 'Set Snooze',
      'null2': '------------------',
      'ticketNotes': 'Add Note',
      'tags': 'Add Tag',
      'todo': 'Add Task',
      'watchers': 'Add Watcher',
      'null3': '------------------',
      // 'forwardTicket': 'Forward a Ticket',
      'lastScenarioExecuted': 'Execute Scenario'
    }
    let actions = this.InternalPolicyForm.get('operations') as FormArray;

    actions.controls.map((control, index) => {
      if (actionList[actions.controls[index].get('operationName').value] && index != i) {
        delete actionList[actions.controls[index].get('operationName').value]
      }
    });
    return actionList;
  }
  addEscalation() {
    let val = this.formbuilder.group({
      duration: ['', []],
      emails: [[], []],
      notifyTo: [['Assigned Agent'], []]
    });

    let form = this.InternalPolicyForm.get('escalation') as FormArray
    form.push(val);
  }

  deleteEscalation(index) {
    let violation = this.InternalPolicyForm.get('escalation') as FormArray;
    violation.removeAt(index);
  }
  deleteReminder(index) {
    let reminder = this.InternalPolicyForm.get('reminder') as FormArray;
    reminder.removeAt(index);
  }
  AddIntPolicy() {

    if (this.allIntPolicies && this.allIntPolicies.filter(data => data.policyName.toLowerCase().trim() == this.InternalPolicyForm.get('policyName').value.toLowerCase().trim()).length > 0) {
      this.snackBar.openFromComponent(ToastNotifications, {
        data: {
          img: 'warning',
          msg: 'Policy name already exists!'
        },
        duration: 3000,
        panelClass: ['user-alert', 'warning']
      });
      return;
    }
    else {

      let policy = {
        nsp: this.nsp,
        policyName: this.InternalPolicyForm.get('policyName').value,
        policyDesc: this.InternalPolicyForm.get('policyDesc').value,
        policyTarget: this.ParseTarget(this.InternalPolicyForm.get('policyTarget')),//.value,
        policyApplyTo: this.ParseApplyTo(this.InternalPolicyForm.get('policyApplyTo')),
        operator: this.InternalPolicyForm.get('operator').value,
        operations: this.ParseActions(this.InternalPolicyForm.get('operations')),
        activated: false,
        reminder: this.setReminder ? this.ParseReminder(this.InternalPolicyForm.get('reminder')) : [],//this.policyForm.get('reminderResponse').value : [],
        escalation: this.ParseEscalation(this.InternalPolicyForm.get('escalation')),
        created: { date: new Date().toISOString(), by: this.email },
        order: this.allIntPolicies.length + 1
      }
      // console.log(policy)
      this._slaPolicyService.AddInternalPolicy(policy).subscribe(res => {
        if (res.status == "ok") {
        }
      });
    }
  }

  UpdateIntPolicy() {

      let policy = {
        nsp: this.nsp,
        policyName: this.InternalPolicyForm.get('policyName').value,
        policyDesc: this.InternalPolicyForm.get('policyDesc').value,
        policyTarget: this.ParseTarget(this.InternalPolicyForm.get('policyTarget')),
        policyApplyTo: this.ParseApplyTo(this.InternalPolicyForm.get('policyApplyTo')),
        operator: this.InternalPolicyForm.get('operator').value,
        operations: this.ParseActions(this.InternalPolicyForm.get('operations')),
        activated: this.InternalPolicyObject.activated,
        reminder: this.setReminder ? this.ParseReminder(this.InternalPolicyForm.get('reminder')) : [],
        escalation: this.ParseEscalation(this.InternalPolicyForm.get('escalation')),
        created: this.InternalPolicyObject.created,
        order: this.InternalPolicyObject.order
      }
      // console.log(policy)
      this._slaPolicyService.updateInternalSLAPolicy(this.selectedIntPolicy._id, policy).subscribe(res => {
        if (res.status == "ok") {
        }
      });
  }
  UnsetReminder() {
    this.setReminder = false;
  }
  ParseReminder(reminder) {
    let remind = [];

    reminder.controls.map(control => {
      // console.log(control.get('notifyTo').value);

      let obj = {
        timeKey: control.get('timeKey').value,
        timeVal: control.get('timeVal').value,
        notifyTo: this.ConvertToEmail(control.get('notifyTo').value),
        emails: control.get('emails').value,
        time: control.get('timeKey').value && control.get('timeVal').value ? this.ConvertToSingleUnit(control.get('timeKey').value + '_' + control.get('timeVal').value) : '',
      }
      remind.push(obj);
    })
    // console.log(remind);

    return remind;
  }
  ParseEscalation(violation) {
    let violate = [];
    violation.controls.map(control => {

      let obj = {
        time: control.get('duration').value ? this.ConvertToSingleUnit(control.get('duration').value) : '',
        duration: control.get('duration').value ? control.get('duration').value : '',
        emails: control.get('emails').value,
        notifyTo: this.ConvertToEmail(control.get('notifyTo').value)
      }
      violate.push(obj);
    })
    return violate;
  }

  ParseTarget(targets) {
    let target = [];
    targets.controls.map(control => {
      let obj = {
        priority: control.get('priority').value.toUpperCase(),
        TimeKey: control.get('TimeKey').value,
        TimeVal: control.get('TimeVal').value,
        timeInMinutes: this.ConvertToSingleUnit(control.get('TimeKey').value + '_' + control.get('TimeVal').value),
        emailActivationEscalation: control.get('emailActivationEscalation').value,
        emailActivationReminder: control.get('emailActivationReminder').value,

      }
      target.push(obj);
    })
    return target;
  }
  ParseApplyTo(slaApply) {
    let applyTo = [];
    slaApply.controls.map(control => {
      let obj = {
        name: control.get('name').value,
        value: (control.get('name').value == 'assigned_to' || control.get('name').value == 'watchers') ? this.ParseValues(control.get('value').value) : control.get('value').value
      }
      applyTo.push(obj);
    })
    return applyTo;
  }
  ParseValues(value) {
    let email = [];
    email = (this.ConvertToEmail(value));
    return email;
  }
  ParseActions(formArray) {
    let actions = [];

    formArray.controls.map(control => {
      switch (control.get('operationName').value) {
        case 'tags':
          control.get('operationValue').value = this.selectedTags;
          control.get('regex').setValue(this.CreateRegex('contains', control.get('operationValue').value))

          break;
        case 'watchers':
          control.get('operationValue').value = this.selectedWatchers;
          control.get('regex').setValue(this.CreateRegex('contains', control.get('operationValue').value))

          break;
        default:
          control.get('operationValue').value = [control.get('operationValue').value];
          control.get('regex').setValue(this.CreateRegex('is', control.get('operationValue').value));

      }
      let obj = {
        operationName: control.get('operationName').value,
        operationValue: control.get('operationValue').value,
        regex: control.get('regex').value
      }
      actions.push(obj);
    })
    return actions;
  }
  GetControls(name) {
    return (this.InternalPolicyForm.get(name) as FormArray).controls;
  }
  ConvertToSingleUnit(time) {
    let key = Number(time.split('_')[0]);
    let val = time.split('_')[1];
    let convertedTime: number;
    switch (val) {
      case 'mins':
        convertedTime = key;
        break;
      case 'hour':
        convertedTime = key * 60;
        break;
      case 'day':
        convertedTime = key * 1440;
        break;
      case 'week':
        convertedTime = key * 10080;
        break;
      case 'month':
        convertedTime = key * 43800;
        break;
    }
    return convertedTime;
  }

  CreateRegex(val, keywords: string[]) {
    let keywordString = '';
    switch (val) {
      case 'contains':
        keywordString = '(' + keywords.join('|') + ')';
        break;
      case 'is':
        keywordString = '\\b(' + keywords.join('|') + ')\\b';
        break;
    }

    return keywordString;
  }

  ConvertToEmail(emails) {
    let convertedEmails = [];
    emails.map(res => {
      if (res == 'Assigned Agent') {
        convertedEmails.push('Assigned Agent');
      }
      else {
        convertedEmails.push(res);
      }
    })
    return convertedEmails;
  }

  GetAvailableViolationDurations(j) {
    let violation = this.InternalPolicyForm.get('escalation') as FormArray;
    let i = Object.keys(this.violate).findIndex((d) => { return d == violation.controls[j].get('duration').value })
    Object.keys(this.violate).map((z, index) => {
      if (index <= i) delete this.violate[z]
      return z
    });
    return this.violate;
  }

  EscalationChanged(i){
    let actions = this.InternalPolicyForm.get('escalation') as FormArray;
		actions.controls[i].get('duration').setValue('');

  }


  GetAvailableApplyTo(i) {
    let applyToList = {
      'group': 'Group',
      'source': 'Source',
      'state': 'State',
      // 'team': 'Team',
      'assigned_to': 'Assigned To',
      'merged': 'Merged',
      'viewState': 'ViewState',
      'watchers': 'Watchers',
      'priority': 'Priority',
      'tags': 'Tags',
      'cannedForm': 'Canned Form'
    }
    let applyTo = this.InternalPolicyForm.get('policyApplyTo') as FormArray;

    applyTo.controls.map((control, index) => {

      if (applyToList[applyTo.controls[index].get('name').value] && index != i) delete applyToList[applyTo.controls[index].get('name').value]
    });
    return applyToList;
  }

  DeleteApplyTo(index) {
    let applyTo = this.InternalPolicyForm.get('policyApplyTo') as FormArray;
    applyTo.removeAt(index);
  }

  addApplyTo() {
    let val = this.formbuilder.group({
      name: ['', Validators.required],
      value: [[], Validators.required]
    });

    let form = this.InternalPolicyForm.get('policyApplyTo') as FormArray
    form.push(val);
  }

  Cancel() {
    if (this.formChanges) {
      this.dialog.open(ConfirmationDialogComponent, {
        panelClass: ['confirmation-dialog'],
        data: { headermsg: 'Are you sure want to leave?' }
      }).afterClosed().subscribe(data => {
        if (data == 'ok') {
          this._slaPolicyService.selectedInternalSLAPolicy.next(undefined);
          this._slaPolicyService.AddInternalSLAPolicy.next(false);
        } else {
          return;
        }
      });
    }
    else {
      this._slaPolicyService.selectedInternalSLAPolicy.next(undefined);
      this._slaPolicyService.AddInternalSLAPolicy.next(false);
    }

  }
  ngOnDestroy() {
    this._slaPolicyService.AddInternalSLAPolicy.next(false);
    this.subscriptions.map(subscription => {
      subscription.unsubscribe();
    });
    this.InternalPolicyObject.reminder.map(res=>{
			res.emails = [];
			res.notifyTo = ['Assigned Agent'];

		});
		this.InternalPolicyObject.escalation.map(res=>{
			res.emails = [];
			res.notifyTo = ['Assigned Agent'];

		});
  }

  loadMoreRem() {
    if (!this.endedRem && !this.loadingMoreAgentsRem && !this.selectedAgentRem.length) {
      this.loadingMoreAgentsRem = true;
      this._utilityService.getMoreAgentsObs(this.all_agents[this.all_agents.length - 1].first_name).subscribe(response => {
        this.all_agents = this.all_agents.concat(response.agents);
        this.endedRem = response.ended;
        this.loadingMoreAgentsRem = false;
      });
    }
  }
  onSearchRem(value) {
    if (value) {
      if (!this.selectedAgentRem.length) {
        let agents = this.all_agents.filter(a => a.email.includes((value as string).toLowerCase()));
        this._utilityService.SearchAgent(value).subscribe((response) => {
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
    } else {
      this.all_agents = this.agent_original_list;
      this.endedRem = false;
    }
  }
  loadMoreEsc() {
    if (!this.endedEsc && !this.loadingMoreAgentsEsc && !this.selectedAgentEsc.length) {
      //console.log('Fetch More');
      this.loadingMoreAgentsEsc = true;
      this._utilityService.getMoreAgentsObs(this.all_agents[this.all_agents.length - 1].first_name).subscribe(response => {
        //console.log(response);
        this.all_agents = this.all_agents.concat(response.agents);
        this.endedEsc = response.ended;
        this.loadingMoreAgentsEsc = false;
      });
    }

  }
  onSearchEsc(value) {
    if (value) {
      if (!this.selectedAgentEsc.length) {
        let agents = this.all_agents.filter(a => a.email.includes((value as string).toLowerCase()));
        this._utilityService.SearchAgent(value).subscribe((response) => {
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
    } else {
      this.all_agents = this.agent_original_list;
      this.endedEsc = false;
    }
  }
  loadMore() {
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
  onSearch(value) {
    if (value) {
      if (!this.selectedAgent.length) {
        let agents = this.all_agents.filter(a => a.email.includes((value as string).toLowerCase()));
        this._utilityService.SearchAgent(value).subscribe((response) => {
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
    } else {
      this.all_agents = this.agent_original_list;
      this.ended = false;
    }
  }
}
