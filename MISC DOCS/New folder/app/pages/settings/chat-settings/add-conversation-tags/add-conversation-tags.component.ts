import { Component, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { ChatSettingService } from '../../../../../services/LocalServices/ChatSettingService';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import { AuthService } from '../../../../../services/AuthenticationService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastNotifications } from '../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { MatDialog } from '@angular/material/dialog';
import { UtilityService } from '../../../../../services/UtilityServices/UtilityService';

@Component({
  selector: 'app-add-conversation-tags',
  templateUrl: './add-conversation-tags.component.html',
  styleUrls: ['./add-conversation-tags.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AddConversationTagsComponent {

  subscriptions: Subscription[] = [];
  public tagList: Array<any> = [];
  public agentList: any = undefined;
  tagForm: FormGroup;
  showForm: boolean = false;
  edit = false;
  selectedTag: any;
  permissions: any;
  loading: boolean;
  Agent: any;
  route: string;
  agentPermissions: any;
  package: any = {};


  constructor(private _chatSettingService: ChatSettingService,
    private _appStateService: GlobalStateService,
    private _authService: AuthService,
    private _utilityService: UtilityService,
    public formbuilder: FormBuilder,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) {

    this._appStateService.contentInfo.next('');
    this._appStateService.breadCrumbTitle.next('Chat & Timeout Settings');
    //#region Form Initializations


    this.tagForm = formbuilder.group({
      'hashTag':
        [
          null,
          [
            Validators.required,
            // Validators.pattern(/^[ \t]*#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z])[ \t]*((,)?#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z]))*$/)
            // Validators.pattern(/^[ \t]*#([0-9a-zA-Z]+)[ \t]*((,)?#([0-9a-zA-Z]+))*$/)
            Validators.pattern(/^[ \t]*#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z])[ \t]*((,)?#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z]))*$/)
          ],
          this.CheckTags.bind(this)
        ]
    });

    this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(agentList => {
      this.agentList = agentList;
    }));

    //#region Initial Data Subscription
    this.subscriptions.push(this._chatSettingService.getChattSettings().subscribe(data => {

      if (data && data.tagList) this.tagList = data.tagList;

    }));


    //#endregion

    this.subscriptions.push(_authService.getSettings().subscribe(data => {

      if (data && data.permissions) {
        this.permissions = data.permissions.tickets;
        this.agentPermissions = data.permissions.agents

      }

    }));
    this.subscriptions.push(this._authService.getAgent().subscribe(agent => {
      if (agent) {
        this.Agent = agent;


      }
    }));
    this.subscriptions.push(this._appStateService.currentRoute.subscribe(data => {

      this.route = data;

    }));

    this.subscriptions.push(_authService.getPackageInfo().subscribe(pkg => {
      // console.log(data);
      if (pkg) {
        this.package = pkg;
        if (!this.package.chats.tags.allowed) {
					this._appStateService.NavigateTo('/noaccess');
				}
      }
    }));

  }

  //#region Async Validators
  private CheckTags() {

    let matched = false

    if (this.tagList && this.tagList.length) {
      this.RemoveDuplicateTags((this.tagForm.get('hashTag').value).split(',')).map(list => {
        if ((this.tagList as Array<any>).indexOf(list) !== -1) matched = true;
      });
    }

    if (matched) {
      return Observable.of({ 'matched': true });
    } else {
      return Observable.of(null);
    }
  }

  RemoveDuplicateTags(array) {

    let arr = {};
    array.map(value => { if (value.trim()) arr[value] = value.trim() });
    return Object.keys(arr);

  }

  public addTags(forVisitors: boolean, forAgents: boolean) {

    if (this.package && this.package.chats.tags.quota <= this.tagList.length) {
      this.snackBar.open("Maximum limit for tags reached", null, {
        duration: 3000,
        panelClass: ['user-alert', 'error']
      });
      return;
    }

    let hashTag = this.tagForm.get('hashTag').value

    let commaseparatedTags = this.RemoveDuplicateTags((hashTag as string).split(','));

    commaseparatedTags = this.tagList.concat(commaseparatedTags)

    if (commaseparatedTags && commaseparatedTags.length) {

      this._chatSettingService
        .setNSPChatSettings(commaseparatedTags, 'tagList')
        .subscribe(response => {
          if (response.status == "ok") {
            this.snackBar.openFromComponent(ToastNotifications, {
              data: {
                img: 'ok',
                msg: 'Tag List updated Successfully!'
              },
              duration: 3000,
              panelClass: ['user-alert', 'success']
            });
          }
          //Do Some Error Logic If Any
          //Check Server Responses For this Event
        });
    }
    this.tagForm.reset();
    this.showForm = false
  }

  DeleteTag(i) {

    if (this.tagList && this.tagList.length) {
      this.tagList.splice(i, 1);
      this._chatSettingService
        .setNSPChatSettings(this.tagList, 'tagList')
        .subscribe(response => {
          if (response.status == "ok") {
            this.snackBar.openFromComponent(ToastNotifications, {
              data: {
                img: 'ok',
                msg: 'Tag List updated Successfully!'
              },
              duration: 3000,
              panelClass: ['user-alert', 'success']
            });
          }
        });
    }
    //this._chatSettingService.deleteConversationTag(this.currentConversation.tags[index], index);
  }


  StopPropagation(event: Event) {
    event.stopImmediatePropagation();
    event.stopPropagation();
  }


  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public ShowForm() {
    this.showForm = !this.showForm;
  }

  setSelectedTag(i) {
    this.selectedTag = this.tagList[i]
  }

}
