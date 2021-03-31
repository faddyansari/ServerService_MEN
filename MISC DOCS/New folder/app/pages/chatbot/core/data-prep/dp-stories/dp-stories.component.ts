import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChatBotService } from '../../../../../../services/ChatBotService'
import { MatDialog } from '@angular/material/dialog';
import { AddStoryDialogComponent } from '../../../../../dialogs/add-story-dialog/add-story-dialog.component';
import { Subscription } from 'rxjs/Subscription';
import { ConfirmationDialogComponent } from '../../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { ToastNotifications } from '../../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dp-stories',
  templateUrl: './dp-stories.component.html',
  styleUrls: ['./dp-stories.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DpStoriesComponent implements OnInit {
  intent_list = [];
  story_list = [];
  action_list=[];
  resp_func_list = [];
  StoryForm: FormGroup;
  subscriptions: Subscription[] = [];
  showintents = false;
  showStoryForm = false;
  intent_id = '';
  resp_func = '';
  action = '';

  constructor(public snackBar: MatSnackBar, private dialog: MatDialog,formbuilder: FormBuilder,  private BotService:ChatBotService) {
		this.StoryForm = formbuilder.group({
		'story_name': [null, Validators.required]
		});

		this.subscriptions.push(BotService.getActions().subscribe(data=>{
		this.action_list =data;
		}));
		this.subscriptions.push(BotService.getIntent().subscribe(data => {
		this.intent_list = data;
		}));
		this.subscriptions.push(BotService.getRespFunc().subscribe(data => {
		this.resp_func_list = data;
		// console.log(this.resp_func_list);
		}));
		this.subscriptions.push(BotService.getStories().subscribe(data => {
		this.story_list = data;
		}));
	}

	ngOnInit() {
	}


	ngOnDestroy() {
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		})
	}

	AddStory(){
		this.dialog.open(AddStoryDialogComponent, {
		disableClose: true
		}).afterClosed().subscribe(response=>{
		if(response.data){
			this.BotService.AddStory(response.data);
		}
		});
	}

	// toggleStoryForm() {
	// 	this.showStoryForm = !this.showStoryForm;
	// }


	showIntents(stories){
		this.resp_func = '';
		this.intent_id = '';
		// this.story_list.map(p=>{
		//   if(p._id==stories._id){
		//     p.showintents= true;
		//   }else{
		//     p.showintents=false;
		//   }
		// });
	}

	selectIntent(event){
		if(event.target.value){
		this.intent_id = event.target.value;
		}
	}

	AddIntentToStory(story){
		//console.log(story._id);
		this.BotService.AddIntentToStory(this.intent_id, story._id).subscribe(response => {
			// this.intent_id = '';
			if (response.status == 'ok') {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
					  img: 'ok',
					  msg: 'Intent added to story successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				  });
				}
		});
	}

	selectRespFunc(event){
		if(event.target.value){
		this.resp_func = event.target.value;
		}
	}


	selectAction(event){
		if(event.target.value){
		this.action = event.target.value;
		}
	}

	addRespFunc(story_id,intent_id){
		this.BotService.AddRespFuncToIntent(intent_id, story_id, this.resp_func).subscribe(response => {
		// this.resp_func = '';
		if (response.status == 'ok') {
			this.snackBar.openFromComponent(ToastNotifications, {
				data: {
				  img: 'ok',
				  msg: 'Response function added under intent successfully!'
				},
				duration: 3000,
				panelClass: ['user-alert', 'success']
			  });
			}
		});
	}



	addAction(story_id,intent_id){
		this.BotService.AddActionToIntent(intent_id, story_id, this.action).subscribe(response => {
		// this.resp_func = '';
		if (response.status == 'ok') {
			this.snackBar.openFromComponent(ToastNotifications, {
				data: {
				  img: 'ok',
				  msg: 'Action added under intent successfully!'
				},
				duration: 3000,
				panelClass: ['user-alert', 'success']
			  });
			}
		});
	}
	//Helpers
	getIntentName(intent_id): string{
		if(intent_id && this.intent_list.filter(i => i._id == intent_id).length){
			return this.intent_list.filter(i => i._id == intent_id)[0].name;
		} else {
			return intent_id;
		}
	}
	getResponseName(resp_id): string {
		if(resp_id && this.resp_func_list.filter(i => i._id == resp_id).length){
			return this.resp_func_list.filter(i => i._id == resp_id)[0].func_name;
		} else {
			return resp_id;
		}
	}

	getActionName(act_id): string {
		if(act_id && this.action_list.filter(i => i._id == act_id).length){
			return this.action_list.filter(i => i._id == act_id)[0].action_name;
		} else {
			return act_id;
		}
	}

	showAddIntent(storyID){
		this.story_list.forEach(s => {
			if(s._id == storyID){
				if(s.intents.length){
					if(s.intents[s.intents.length - 1].respFuncs.length || s.intents[s.intents.length - 1].actions.length ){
						// console.log('Resp func length: ' + s.intents[s.intents.length - 1].respFuncs.length);
						return 'show';
					} else {
						return 'hide';
					}
				} else {
					return 'hide';
				}
			}
		});
	}

	deleteStory(story, index){
		this.dialog.open(ConfirmationDialogComponent, {
			panelClass: ['confirmation-dialog'],
			data: { headermsg: "Are you sure to delete story " + story.story_name + " ?" }
		}).afterClosed().subscribe(data => {
			if (data == 'ok') {
				this.BotService.deleteStory(story._id, index);
			}
		});
	}


}
