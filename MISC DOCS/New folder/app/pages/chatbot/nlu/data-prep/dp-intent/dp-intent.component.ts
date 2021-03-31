import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmationDialogComponent } from '../../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs/Subscription';
import { ChatBotService } from '../../../../../../services/ChatBotService';
import { ToastNotifications } from '../../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
declare var window: Window;

@Component({
	selector: 'app-dp-intent',
	templateUrl: './dp-intent.component.html',
	styleUrls: ['./dp-intent.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class DpIntentComponent implements OnInit {

	// selectAll = false;
	// editMode = false;
	// checked_list = [];
	// edit = false;
	intent_list = [];
	t_phrase_list = [];
	entities_list = [];
	add = false;
	intentID = 0;

	IntentForm: FormGroup;
	TrainingForm: FormGroup;
	subscriptions: Subscription[] = [];
	list = [];
	showTrainingPhrasesOpts = false;
	showTrainingPhrasesForm = false;
	trainingPhraseSelected = false;
	showIntentForm = false;
	updatedIntent = '';

	// @HostListener('input', ['$event.target'])

	constructor(public snackBar: MatSnackBar, formbuilder: FormBuilder, private dialog: MatDialog, private BotService: ChatBotService) {
		this.IntentForm = formbuilder.group({
			'name': [null, Validators.required]
		})
		this.TrainingForm = formbuilder.group({
			'training_phrases': [null, Validators.required]

		})

		this.subscriptions.push(BotService.getEntity().subscribe(data => {
			this.entities_list = data;
			// console.log('Entities List');

		}));

		this.subscriptions.push(BotService.getIntent().subscribe(data => {
			this.intent_list = data;
		}));

		this.subscriptions.push(BotService.getTPhrase().subscribe(data => {
			this.t_phrase_list = data;
			// console.log('Phrase List!');

		}));
	}


	// @HostListener('mouseup', ['$event'])
	// MouseEvent(event) {
	//   console.log('Mouse Up');

	//   if (event.target.id == 'training_phrase') {
	//     var text = "";
	//     if (window.getSelection) {
	//       text = window.getSelection().toString();
	//     }
	//     if (text != "") {
	//       this.showTrainingPhrasesOpts = true;
	//     } else {
	//       this.showTrainingPhrasesOpts = false;
	//     }
	//   }
	// }

	ngOnInit() { }

	ngOnDestroy() {
		// Called once, before the instance is destroyed.
		// Add 'implements OnDestroy' to the class.
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		})

	}

	// Save(){
	//  //Send a rest call or call an api from ChatBotService
	// }

	AddIntent(name) {
		this.BotService.addIntent(name);
		this.IntentForm.reset();
	}

	ToggleAdd() {
		this.add = !this.add;
	}

	editIntent(intent) {
		this.updatedIntent = '';
		this.intent_list.map(i => {
			if (i._id == intent._id) {
				i.editable = true;
				this.updatedIntent = i.name;
				return i;
			}
		})
	}

	cancelEdit(intent) {
		this.intent_list.map(i => {
			if (i._id == intent._id) {
				i.editable = false;
				return i;
			}
		})
	}

	updateIntent(intent) {
		intent.editable = false;
		this.BotService.updateIntent(intent._id, this.updatedIntent);
		this.updatedIntent = '';
	}

	deleteIntent(intent, index) {
		this.dialog.open(ConfirmationDialogComponent, {
			panelClass: ['confirmation-dialog'],
			data: { headermsg: "Are you sure to delete " + intent.name + " ?" }
		}).afterClosed().subscribe(data => {
			if (data == 'ok') {
				// this.intent_list.splice(index, 1);
				// this.t_phrase_list.filter(i => i.intent_id == intent.id).forEach((element, index) => {
				//   this.t_phrase_list.splice(index,1);
				// })
				this.BotService.deleteIntent(intent._id, index);
			}
		});
		// this.BotService.updateIntentList(this.intent_list);
	}

	showTrainingPhrases(intent) {
		this.intent_list.map(i => {
			if (i._id == intent._id) {
				i.trainingPhrases = true;
				this.trainingPhraseSelected = true;
				return i;
			}
			i.trainingPhrases = false;
		});
		//console.log(this.intent_list);

	}

	toggleTrainingPhraseForm() {
		this.showTrainingPhrasesForm = !this.showTrainingPhrasesForm;
	}

	toggleIntentForm() {
		this.showIntentForm = !this.showIntentForm;
	}


	AddTPhrase(name, id) {
		this.BotService.addTPhrase(name, id);
		this.TrainingForm.reset();
	}


	deleteTrainPhrase(trainPhrase, index) {
		this.dialog.open(ConfirmationDialogComponent, {
			panelClass: ['confirmation-dialog'],
			data: { headermsg: "Are you sure to delete this PHRASE ?" }
		}).afterClosed().subscribe(data => {
			if (data == 'ok') {
				// this.t_phrase_list.splice(index, 1);
				this.BotService.deleteTPhrase(trainPhrase._id, trainPhrase.intent_id, index);
			}
		});
		// this.BotService.updateTPhraseList(this.t_phrase_list);
	}


	// getSelectionText() {
	//     var text = "";
	//     if (window.getSelection) {
	//         text = window.getSelection().toString();
	//     } else if ((document as HTMLDocument).selection && document.selection.type != "Control") {
	//         text = document.selection.createRange().text;
	//     }
	//     return text;
	//   }

	toggleSelection(j) {
		setTimeout(() => {
			if (window.getSelection().type == 'None') { j.markable = false; return };
			var text = window.getSelection().toString();
			var start = window.getSelection().getRangeAt(0).startOffset;
			var end = window.getSelection().getRangeAt(0).endOffset;

			this.t_phrase_list.map(i => {
				if (i._id == j._id && text && start != end) {
					i.markable = true;
					return i;
				}
				else {
					i.markable = false;
					return i;
				}
				// i.markable = false;
			})
		}, 0);

	}


	scrollDown(tPhrase) {
		this.t_phrase_list.map(i => {
			if (i._id == tPhrase._id) {
				tPhrase.entities.map(p => {
					if (p.id) {
						i.isScroll = true;
						i.markable = false;
					} else {
						i.isScroll = false;
						i.markable = false;
					}
				});
				return i;
			}
		});
	}



	scrollUp(tPhrase) {
		console.log('hello');

		this.t_phrase_list.map(i => {
			if (i._id == tPhrase._id) {
				tPhrase.entities.map(p => {
					if (p.id) {
						i.isScroll = false;
					}
				});
				return i;
			}
		});
	}

	dupError(tPhrase) {
		this.t_phrase_list.map(i => {
			if (i._id == tPhrase._id) {
				tPhrase.entities.map(p => {
					if (p.id) {
						i.markable = false;
						console.log('Can not mark duplicate entity');
					}
				});
				return i;
			}
		});
	}

	MarkPhrase(tPhrase) {
		var text = window.getSelection().toString();
		var start = window.getSelection().getRangeAt(0).startOffset;

		var end = window.getSelection().getRangeAt(0).endOffset;
		this.BotService.markPhrase(tPhrase._id, start, end, text).subscribe(response => {
			if (response == 'ok') {

				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'ok',
						msg: 'Word marked successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				});
				this.scrollDown(tPhrase);
			} else {
				// this.scrollUp(tPhrase);
				this.dupError(tPhrase)
			}
		});
		window.getSelection().empty();
	}


	selectEntity(phrase, entity, event) {
		this.BotService.selEntity(phrase._id, entity.id, event.target.value);
	}


	deleteMarkedEntity(tPhraseId, entId, index) {
		this.dialog.open(ConfirmationDialogComponent, {
			panelClass: ['confirmation-dialog'],
			data: { headermsg: "Are you sure to delete this marked entity ?" }
		}).afterClosed().subscribe(data => {
			if (data == 'ok') {
				// this.t_phrase_list = JSON.parse(JSON.stringify(this.t_phrase_list));
				this.BotService.delMarkEnt(tPhraseId, entId, index);
			}
		});
	}



}