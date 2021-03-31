import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ChatService } from '../../services/ChatService';
import { GlobalStateService } from '../../services/GlobalStateService';
import { AuthService } from '../../services/AuthenticationService';
import { AdminSettingsService } from '../../services/adminSettingsService';
import { CallingService } from '../../services/CallingService';
import { UploadingService } from '../../services/UtilityServices/UploadingService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CallDialogComponent } from '../dialogs/call-dialog/call-dialog.component';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

var RecordRTC = require('recordrtc');

@Component({
	selector: 'app-visitors-fixed-chat-sidebar',
	templateUrl: './visitors-fixed-chat-sidebar.component.html',
	styleUrls: ['./visitors-fixed-chat-sidebar.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class VisitorsFixedChatSidebarComponent implements OnInit {
	@ViewChild('fileInput') fileInput: ElementRef;
	subscriptions: Subscription[] = [];
	currentConversation: any = {};
	chatList = [];
	links = [];
	fileerror: string;
	feedback: any;
	selectedVisitor: any;
	agent: any;
	nsp = '';
	automatedMessagesList = [];
	callSettings: any;
	fileSharePermission = true;
	fileUploadParams = {
		key: '',
		acl: '',
		success_action_status: '',
		policy: '',
		"x-amz-algorithm": '',
		"x-amz-credintials": '',
		"x-amz-date": '',
		"x-amz-signature": ''

	}
	//Call Record
	mediaStream: MediaStream;
	recordRTC: any;
	seconds: number = 0;
	mins: number = 0;
	imagetarget: any;
	recordingStarted = false;
	isAudioSent = false;
	recordingInterval: any;
	recordedFile: any;
	filteredAutomatedMessages = [];
	ShowAttachmentAreaDnd = false;
	files: any = [];
	file: any = undefined;
	hashQuery = '';
	hashIndex = -1;
	shiftdown = false;
	ready = false;
	msgBody = '';
	uploading = false;
	arrToDialog = [];
	fileValid = true;
	count = 0;
	isDragged = false;
	loading = false;
	EmojiWrapper: boolean = false;
	drafts = [];
	chatPermissions: any;
	CheckTypingState: Subject<any> = new Subject()
	tempTypingState: boolean = false;


	CannedForms: any;
	actionForm: any = '';

	//textArea AutoComplete
	formHashQuery: boolean = false
	tempMsgBody: string = ''
	hashQuerySelected = false;
	autoGrowSyncMsgBody: string = ''
	restrictAutoSize: boolean;
	attachmentGallery = [];
	@ViewChild('chatMessage') messageTextArea: ElementRef;
	uploadingCount: number = 0;
	agentPermissions: any;

	constructor(private _chatService: ChatService,
		private _applicationStateService: GlobalStateService,
		private _authService: AuthService,
		private _adminSettingsService: AdminSettingsService,
		public dialog: MatDialog,
		private snackBar: MatSnackBar,
		private _uploadingService: UploadingService,
		private _callingService: CallingService) {
		this.subscriptions.push(this._chatService.AllConversations.subscribe(data => {
			this.chatList = data;
		}));
		this.subscriptions.push(this._chatService.messageDrafts.subscribe(data => {
			this.drafts = data;
		}));



		this.subscriptions.push(_chatService.ShowAttachmentAreaDnd.subscribe(data => {
			this.ShowAttachmentAreaDnd = data;
		}));

		this.subscriptions.push(this._chatService.getCurrentConversation().subscribe(data => {
			if (Object.keys(data).length) {
				if (data && this.currentConversation && (this.currentConversation._id != data._id)) {


					let draft = {
						id: this.currentConversation._id,
						message: (this.msgBody) ? this.msgBody : ''
					}
					this._chatService.SetDraft(draft);


					this._chatService.ShowAttachmentAreaDnd.next(false)
					this.files = [];
					this.arrToDialog = []
					this.attachmentGallery = []
					this.shiftdown = false

					if (this.drafts.length) {
						let draft = this.drafts.filter(d => d.id == data._id);
						if (draft && draft.length) {
							this.msgBody = draft[0].message;
						}
						else this.msgBody = ''
					}
				}

				this.currentConversation = data;

				//}
				if (this.currentConversation.state == 4) {
					if (this.currentConversation.feedback && this.currentConversation.feedback.Q2 && !isNaN(this.currentConversation.feedback.Q2)) {
						this.feedback = Array(parseInt(this.currentConversation.feedback.Q2)).fill(1);
					}
				}
				if (data && (data as Object).hasOwnProperty('_id')) {
					//setTimeout(() => {
					this.restrictAutoSize = false
					// 	this._appStateService.selectingThread.next(false)
					//}, 0);
				}
			}
			else this.currentConversation = {};
		}));
		this.subscriptions.push(this._authService.getSettings().subscribe(data => {
			this.automatedMessagesList = data.automatedMessages;
		}));

		this.subscriptions.push(this._authService.Agent.subscribe(data => {
			this.agent = data;
			this.nsp = data.nsp;
		}));

		this.subscriptions.push(this._chatService.GetSelectedVisitor().subscribe(selectedVisitor => {
			this.selectedVisitor = selectedVisitor;
		}));

		this.subscriptions.push(this._adminSettingsService.getFileSharingSettings().subscribe(fileSharingSettings => {
			this.fileSharePermission = fileSharingSettings;
		}));
		this.subscriptions.push(this._adminSettingsService.callSettings.subscribe(data => {
			this.callSettings = data;
		}));
		this.subscriptions.push(this._authService.getSettings().subscribe(data => {

			if (data && data.permissions) {
				this.chatPermissions = data.permissions.chats;
				this.agentPermissions = data.permissions.agents;
			}

		}));

		this.subscriptions.push(this._chatService.tempTypingState.subscribe(data => {
			this.tempTypingState = data;
		}));

		this.subscriptions.push(this.CheckTypingState.debounceTime(500).subscribe(data => {


			if (!this.msgBody.trim()) {
				this._chatService.SendTypingEventRest({ state: false, conversation: this.currentConversation }).subscribe(data => {
					this._chatService.tempTypingState.next(false)
				})
			}
			else if (this.msgBody.trim().length > 1 && !this.tempTypingState) {
				this._chatService.SendTypingEventRest({ state: true, conversation: this.currentConversation }).subscribe(data => {
					this._chatService.tempTypingState.next(true)
				})
			}
			else {
				if (this.msgBody.trim().length < 2 && !this.tempTypingState) {
					this._chatService.SendTypingEventRest({ state: true, conversation: this.currentConversation }).subscribe(data => {
						this._chatService.tempTypingState.next(true)
					})
				}
			}
		}));


		this.subscriptions.push(this._chatService.CannedForms.subscribe(forms => {
			if (forms && forms.length) {
				this.CannedForms = forms;
				this.CannedForms.map(forms => {
					if (forms.formName.indexOf('##') == -1) forms.formName = '##' + forms.formName
					return forms
				});

			}


		}));

	}

	ngOnInit() {
	}
	toggleChatBar() {
		this._applicationStateService.toggleChatBar();
	}
	setChatBar() {
		this._applicationStateService.setChatBar(true);
	}
	// filterInput(autocompleteString: string) {


	// 	this.filteredAutomatedMessages = this.automatedMessagesList.filter(automatedMessage => {

	// 		if (automatedMessage.hashTag.indexOf(autocompleteString) != -1 && autocompleteString) {
	// 			return automatedMessage;

	// 		}
	// 	})

	// }


	filterInput(autocompleteString: string) {
		this.filteredAutomatedMessages = this.automatedMessagesList.filter(automatedMessage => {
			if (automatedMessage.hashTag.toLowerCase().indexOf(autocompleteString) != -1 && autocompleteString) {
				return automatedMessage;
			}
		})
	}

	filterInput1(autocompleteString: string) {
		if (this.formHashQuery) {
			// this.filteredAutomatedMessages = []
			this.filteredAutomatedMessages = this.CannedForms.filter(forms => {
				if (forms.formName.toLowerCase().indexOf(autocompleteString.toLowerCase()) != -1 && autocompleteString) {
					return forms;
				}
			})
		}
		else {
			this.filteredAutomatedMessages = this.automatedMessagesList.filter(automatedMessage => {

				if (automatedMessage.hashTag.toLowerCase().indexOf(autocompleteString.toLowerCase()) != -1 && autocompleteString) {
					return automatedMessage;
				}
			})
		}
	}

	clearinputFilter() {
		this.hashQuery = '';
		this.hashIndex = -1;
		this.caretPosition = -1;
	}
	//typingEvent
	TypingEvent(e: Event) {
		this.CheckTypingState.next()
		this.tempMsgBody = this.msgBody
	}

	setShift() {
		if (this.hashQuerySelected) {
			this.hashQuery = '';
			this.hashQuerySelected = false
		}

	}

	keydown(event: KeyboardEvent) {
		switch (event.key.toLowerCase()) {
			case 'shift':
				this.shiftdown = true;
				break;
			case 'enter':
				if (!this.msgBody && !this.shiftdown) {
					event.preventDefault();
				}
				else if (!this.shiftdown) return false
				break;
		}
	}


	keydown1(event: KeyboardEvent) {

		switch (event.key.toLowerCase()) {
			case 'shift':
				this.shiftdown = true;
				break;
			case 'enter':
				if (this.actionForm && this.actionForm.length) this.shiftdown = false
				if (!this.msgBody && !this.shiftdown) {
					event.preventDefault();
				}
				else if (this.msgBody && !this.shiftdown && !this.hashQuery && !this.hashQuerySelected) {
					//console.log('Emptying Message');

					this.autoGrowSyncMsgBody = this.msgBody;
					this.msgBody = '';
				}
				break;
		}

	}

	keyup(event: KeyboardEvent) {

		if (this.hashQuery) {

			switch (event.key.toLowerCase()) {
				case 'backspace':
					{
						if (this.autoComplete) {
							this.clearinputFilter();
						} else {
							this.hashQuery = this.hashQuery.substr(0, this.hashQuery.length - 1);
						}
						break;
					}

				case 'arrowleft':
				case 'arrowright':
				case ' ':
				case 'enter':
					{
						if (this.shiftdown) this.shiftdown = false;
						(event.target as HTMLTextAreaElement).selectionStart = this.caretPosition;
						(event.target as HTMLTextAreaElement).selectionEnd = this.caretPosition;
						this.clearinputFilter();
						break;
					}
				default:
					//////console.log('default 1');
					(event.target as HTMLTextAreaElement).focus()
					break;
			}


		} else {
			switch (event.key.toLowerCase()) {
				case 'enter':
					{
						if (this.shiftdown) {
							event.preventDefault();
						} else {
							let id = this.currentConversation._id
							this._chatService.DeleteDraft(id)
							this.SendMessage();
						}
						break;
					}


				case 'shift':
					{
						setTimeout(() => {
							this.shiftdown = false;
						}, 100);
						break;
					}
			}

		}
		this.filterInput(this.hashQuery);
	}

	//for Canned Forms
	//for Canned Forms
	keyup1(event: KeyboardEvent) {


		if (this.hashQuery && !this.formHashQuery) {

			switch (event.key.toLowerCase()) {
				case 'backspace':
					{
						if (this.autoComplete) {
							this.clearinputFilter();
						} else {
							this.hashQuery = this.hashQuery.substr(0, this.hashQuery.length - 1);
						}
						break;
					}

				case 'arrowleft':
				case 'arrowright':
				case ' ':
				case 'enter':
					{
						if (this.shiftdown) this.shiftdown = false;
						(event.target as HTMLTextAreaElement).selectionStart = this.caretPosition;
						(event.target as HTMLTextAreaElement).selectionEnd = this.caretPosition;
						this.clearinputFilter();
						break;
					}
				default:
					//console.log('default 1');
					(event.target as HTMLTextAreaElement).focus()
					break;
			}


		}
		else if (this.hashQuery && this.formHashQuery) {
			switch (event.key.toLowerCase()) {

				case 'backspace':
					this.formHashQuery = false;
					//this.shiftdown = false;
					// if (this.autoComplete) {
					// 	this.clearinputFilter();
					// } else {
					// this.hashQuery = this.hashQuery.substr(0, this.hashQuery.length - 1);

					if (this.hashQuery == '##') {
						this.hashQuery = this.hashQuery.substr(0, this.hashQuery.length - 1);
						this.hashIndex = (event.target as HTMLTextAreaElement).selectionStart - 1;
					}
					// }
					break;

				case 'arrowleft':
				case 'arrowright':
				case ' ':
				case 'enter':
					{
						if (this.shiftdown) this.shiftdown = false;
						// (event.target as HTMLTextAreaElement).selectionStart = this.caretPosition;
						// (event.target as HTMLTextAreaElement).selectionEnd = this.caretPosition;
						this.clearinputFilter();
						break;
					}
				// case '#':

				// 	this.hashQuery = this.hashQuery.substr(0, this.hashQuery.length - 1);
				// 	//this.filterInput(this.hashQuery);
				// 	break;

			}
		}
		else {
			switch (event.key.toLowerCase()) {
				case 'enter':
					{

						if ((this.shiftdown || !this.autoGrowSyncMsgBody.trim()) && (this.actionForm && !this.actionForm.length)) {
							event.preventDefault();
						} else {

							this.SendMessage();
							this._chatService.DeleteDraft(this.currentConversation._id)
						}
						break;
					}


				case 'shift':
					{
						setTimeout(() => {
							this.shiftdown = false;
						}, 100);
						break;
					}

				default:
					break;
			}

		}
		if (this.hashQuerySelected) {
			this.hashQuery = '';
			this.hashQuerySelected = false
		}

		this.filterInput(this.hashQuery);
	}

	// this.actionForm = this.CannedForms.filter(form => { return form.formName == event.source.value })
	// this.caretPosition = this.hashIndex;
	// if (this.actionForm && this.actionForm.length > 0) {
	// 	setTimeout(() => {
	// 		this.ShowAttachmentAreaDnd = true
	// 	}, 0);
	// }

	ItemSelected(event) {


		this.caretPosition = this.hashIndex + event.option.value.length;
		let hashQueryFilter = this.hashQuery.split('#')[1];
		this.msgBody = (event.option.value) ? this.tempMsgBody.slice(0, this.hashIndex) + event.option.value + this.tempMsgBody.slice(this.hashIndex + 1 + hashQueryFilter.length) : this.tempMsgBody.slice(0, this.hashIndex) + this.tempMsgBody.slice(this.hashIndex + 1 + hashQueryFilter.length)
		this.hashQuerySelected = true
		if (this.shiftdown) this.shiftdown = false;

		this.filteredAutomatedMessages = []
		this.formHashQuery = false
	}

	ItemSelected1(event) {

		if (this.formHashQuery && event.option.value) {

			let hashQueryFilter = this.hashQuery.split('##')[1];
			this.caretPosition = this.hashIndex - 1;

			this.msgBody = ((this.tempMsgBody) ? this.tempMsgBody.slice(0, this.hashIndex - 1) : '') + this.tempMsgBody.slice(this.hashIndex + 1 + hashQueryFilter.length);
			this.actionForm = this.CannedForms.filter(form => { return form.formName == event.option.value })
			if (this.actionForm && this.actionForm.length > 0) {
				//this.ShowAttachmentAreaDnd = true
				this.hashQuerySelected = true
				if (this.shiftdown) this.shiftdown = false;

				this._chatService.ShowAttachmentAreaDnd.next(true);
				// setTimeout(() => {
				// 	this.hashQuery = ''
				// }, 500);
			}
		}
		else if (!this.formHashQuery) {
			this.caretPosition = this.hashIndex + event.option.value.length;
			let hashQueryFilter = this.hashQuery.split('#')[1];
			this.msgBody = (event.option.value) ? this.tempMsgBody.slice(0, this.hashIndex) + event.option.value + this.tempMsgBody.slice(this.hashIndex + 1 + hashQueryFilter.length) : this.tempMsgBody.slice(0, this.hashIndex) + this.tempMsgBody.slice(this.hashIndex + 1 + hashQueryFilter.length)
			//this.msgBody = this.tempMsgBody.slice(0, this.hashIndex) + event.option.value + this.tempMsgBody.slice(this.hashIndex + 1 + hashQueryFilter.length)
			this.hashQuerySelected = true
			if (this.shiftdown) this.shiftdown = false;
			// setTimeout(() => {
			// 	this.hashQuery = ''
			// }, 500);
		}
		this.filteredAutomatedMessages = []
		this.formHashQuery = false

	}



	//for Canned Forms
	autoComplete = true;
	caretPosition = -1;
	keyPress(event: KeyboardEvent) {
		if (event.key == '#') {
			this.hashQuery = '#';
			this.hashIndex = (event.target as HTMLTextAreaElement).selectionStart;
		} else if (this.hashQuery) {
			this.hashQuery += event.key;
		}
	}

	//for Canned Forms
	// autoComplete = true;
	// caretPosition = -1;
	keyPress1(event: KeyboardEvent) {
		if (event.key == '#') {
			if (this.hashQuery == '#') {
				this.formHashQuery = true
				this.hashQuery = '##'
				this.hashIndex = (event.target as HTMLTextAreaElement).selectionStart;
			}
			else if (this.hashQuery == '') {
				this.hashQuery = '#';
				this.hashIndex = (event.target as HTMLTextAreaElement).selectionStart;
			}
			else {
				this.hashQuery += event.key;
			}
		}
		else if (this.hashQuery) {
			this.hashQuery += event.key;
		}
	}


	stopRecording() {
		if (!this.isAudioSent && !this.recordedFile) {
			this.seconds = 0;
			this.mins = 0;
			this.recordingStarted = false;
			this.loading = true;
			this.recordRTC.stopRecording(() => {
				// let recording = this.recordRTC.getBlob();
				this._uploadingService.getSeekableBlob(this.recordRTC.getBlob(), (blob) => {
					let file = new File([blob], ('stream' + new Date().getTime() + '.mp3'), { type: 'audio/webm' });
					if (file && !this.uploading) {
						this.uploading = true;
						this._uploadingService.SignRequest(file, 'SendAttachMent').subscribe(response => {
							let params = JSON.parse(response.text());
							params.file = file;
							this._uploadingService.uploadAttachment(params).subscribe(s3response => {
								if (s3response.status == '201') {

									this._uploadingService.parseXML(s3response.text()).subscribe(json => {

										this._chatService.SendAttachment(this.currentConversation.sessionid, {
											from: this.agent.nickname,
											to: this.currentConversation.sessionid,
											body: [{ filename: file.name, path: json.response.PostResponse.Location[0] }],
											cid: this.currentConversation._id,
											attachment: true,
											filename: file.name
										}, file.name).subscribe(res => { }, err => { });
										this.file = '';
										this.fileInput.nativeElement.value = '';
										this.uploading = false;
										this.loading = false;
									}, err => {
										this.uploading = false;
										this.loading = false;
									});
								}
							}, err => {
								this.uploading = false;
								this.loading = false;
							});
						}, err => {
							this.uploading = false;
							this.loading = false;
							this.fileValid = false;
							setTimeout(() => [
								this.fileValid = true
							], 3000);
						});
					}
					// saveAs(file, 'stream'+ new Date().getTime() + '.mp3');
					this.mediaStream.getTracks()[0].stop();
					this.isAudioSent = true;
					clearInterval(this.recordingInterval);
				});
			});
		} else if (this.recordedFile) {
			this.uploading = true;
			this._uploadingService.SignRequest(this.recordedFile, 'SendAttachMent').subscribe(response => {
				let params = JSON.parse(response.text());
				params.file = this.recordedFile;
				this._uploadingService.uploadAttachment(params).subscribe(s3response => {
					if (s3response.status == '201') {
						this._uploadingService.parseXML(s3response.text()).subscribe(json => {
							this._chatService.SendAttachment(this.currentConversation.sessionid, {
								from: this.agent.nickname,
								to: this.currentConversation.sessionid,
								body: [{ filename: this.recordedFile.name, path: json.response.PostResponse.Location[0] }],
								cid: this.currentConversation._id,
								attachment: true,
								filename: this.recordedFile.name
							}, this.recordedFile.name).subscribe(res => { }, err => { });
							this.recordedFile = undefined;
							this.fileInput.nativeElement.value = '';
							this.uploading = false;
							this.loading = false;
							this.mediaStream.getTracks()[0].stop();
							this.isAudioSent = true;
							clearInterval(this.recordingInterval);
						}, err => {
							this.uploading = false;
							this.loading = false;
						});
					}
				}, err => {
					this.uploading = false;
					this.loading = false;
				});
			}, err => {
				this.uploading = false;
				this.loading = false;
				this.fileValid = false;
				setTimeout(() => [
					this.fileValid = true
				], 3000);
			});
		}
	}





	//with draft
	// public SendMessage() {
	// 	if (this.files && this.files.length && !this.uploading) {
	// 		this.uploading = true;
	// 		let abc = this.files
	// 		this._uploadingService.GenerateLinks(abc, 'SendAttachMent').subscribe(response => {

	// 			//console.log(response);
	// 			let filesReadyToUpload = response.filter(file => {
	// 				return (!(file as Object).hasOwnProperty('error'))
	// 			});

	// 			this.file = [];

	// 			this.errorFile = response.filter(file => {
	// 				return ((file as Object).hasOwnProperty('error'))
	// 			});
	// 			if ((this.errorFile && this.errorFile.length)) {

	// 				this.errorFile.map(file => {

	// 					//console.log(file.error);

	// 					this._uploadingService.ShowAttachmentError(file.error).subscribe(fileerror => {
	// 						//console.log(fileerror);

	// 						file.error = fileerror


	// 						if (file.error) {
	// 							this.fileValid = false;
	// 							this.uploading = false;
	// 							this.fileInput.nativeElement.value = '';
	// 							this.ClearFile();
	// 						}
	// 					}, err => {
	// 						this.fileValid = false;
	// 						file.error = "Error in uploading..Please try again!"
	// 						this.uploading = false;

	// 					});
	// 					return file
	// 				});
	// 				//this.fileerror = true

	// 			}


	// 			//console.log(this.errorFile)

	// 			if (filesReadyToUpload && filesReadyToUpload.length) {

	// 				let attachment = filesReadyToUpload;

	// 				this._chatService.SendAttachment(this.currentConversation.sessionid, {
	// 					from: this.agent.nickname,
	// 					to: this.currentConversation.sessionid,
	// 					body: attachment,
	// 					cid: this.currentConversation._id,
	// 					attachment: true,
	// 					form: this.actionForm
	// 				}).subscribe(res => {
	// 					if (res.status == "ok") {
	// 						this.uploading = false;

	// 						this.currentConversation.arrToDialog = []
	// 						this.currentConversation.arrToDialog = []

	// 						this._chatService.setDraftFiles(this.currentConversation._id, [], [])

	// 						// filesReadyToUpload.forEach(x => {
	// 						// 	this.currentConversation.arrToDialog.splice(this.currentConversation.arrToDialog.findIndex(w => w.name == x.filename), 1);
	// 						// });

	// 					}
	// 				});

	// 				//console.log(this.currentConversation.arrToDialog);

	// 				this.actionForm = '';
	// 				if (this.currentConversation.arrToDialog && !this.currentConversation.arrToDialog.length) {
	// 					this.currentConversation.arrToDialog = [];
	// 					this.files = [];
	// 					if (this.errorFile && !this.errorFile.length) this._chatService.ShowAttachmentAreaDnd.next(false);
	// 				}

	// 			}


	// 		}, err => {
	// 		});

	// 	}
	// 	if (this.autoGrowSyncMsgBody.trim() || (this.actionForm && this.actionForm.length)) {

	// 		this._chatService.SendMessage(this.currentConversation.sessionid, {
	// 			from: this.agent.nickname,
	// 			to: this.currentConversation.sessionid,
	// 			body: this.autoGrowSyncMsgBody.trim(),
	// 			cid: this.currentConversation._id,
	// 			form: this.actionForm
	// 		});
	// 		//setTimeout(() => {
	// 		this.msgBody = '';
	// 		this.autoGrowSyncMsgBody = '';
	// 		//}, 0);
	// 	}
	// 	this._chatService.SendTypingEventRest({ state: false, conversation: this.currentConversation }).subscribe(data => {
	// 		this._chatService.tempTypingState.next(false)

	// 	})
	// 	this._chatService.setAutoScroll(true);
	// 	this._chatService.conversationSeen();
	// }

	keyDownFunction(event: MouseEvent) {
		//
		if (event.which == 1) {
			let result
			let ev = new KeyboardEvent("keydown", {
				shiftKey: false,
				bubbles: true,
				cancelable: false,
				key: "Enter",
			});
			result = (this.messageTextArea.nativeElement as HTMLElement).dispatchEvent(ev);
			let ev1 = new KeyboardEvent("keypress", {
				shiftKey: false,
				bubbles: true,
				cancelable: false,
				key: "Enter",
			});
			result = (this.messageTextArea.nativeElement as HTMLElement).dispatchEvent(ev1);

			let ev3 = new KeyboardEvent("keyup", {
				shiftKey: false,
				bubbles: true,
				cancelable: false,
				key: "Enter",
			});
			this.keyup((ev3 as KeyboardEvent));


		}

	}

	SendMessageSingleAttach(file, conversation) {
		this.uploading = true
		let galleryIndex = this.attachmentGallery.findIndex(w => w.name == file.name);
		if (galleryIndex != -1) {
			this.attachmentGallery[galleryIndex].uploading = true;
		}
		this._uploadingService.GenerateLinksForFiles(file, 'SendAttachMent').subscribe(response => {
			if (response) {

				this.uploadingCount = this.uploadingCount - 1
				if (this.uploadingCount == 0) {

					this.uploading = false
				}
				if (!response.error) {
					this._chatService.SendAttachment(conversation.sessionid, {
						from: this.agent.nickname,
						to: conversation.sessionid,
						body: [response],
						cid: conversation._id,
						attachment: true,
						form: this.actionForm
					}, file.name).subscribe(res => { }, err => { });

					let galleryIndex = this.attachmentGallery.findIndex(w => w.name == file.name);
					if (galleryIndex != -1) {
						this.attachmentGallery[galleryIndex].uploading = false;
						this.attachmentGallery.splice(galleryIndex, 1);
					}
					let fileIndex = this.files.findIndex(w => w.name == file.name);
					if (fileIndex != -1) this.files.splice(fileIndex, 1);


				} else {
					file.error = true;
					let ind = this.attachmentGallery.findIndex(w => w.name == file.name);
					if (ind != -1) {
						this.attachmentGallery[ind].uploading = false;
						this._uploadingService.ShowAttachmentError(response.error).subscribe(value => {
							this.attachmentGallery[ind].error = value;
						});
					}


				}
			}
		}, err => {
			let ind = this.attachmentGallery.findIndex(w => w.name == file.name);
			if (ind != -1) {
				this.attachmentGallery[ind].uploading = false;
				this.attachmentGallery[ind].error = 'error in uploading';
			}

		});
	}
	public SendMessage() {
		let conversation = JSON.parse(JSON.stringify(this.currentConversation));
		if (this.files && this.files.length && !this.uploading) {
			//for sending attachment 1 by 1
			this.uploadingCount = this.files.length
			this.files.map((file) => {
				this.SendMessageSingleAttach(file, conversation);
			});
			this.fileInput.nativeElement.value = '';

			//for sending attachment all at once
			// this.uploading = true;
			// this._uploadingService.GenerateLinks(this.files, 'SendAttachMent').subscribe(response => {

			// 	let filesReadyToUpload = response.filter(file => {
			// 		return (!(file as Object).hasOwnProperty('error'))
			// 	});
			// 	this.file = response.filter(file => {
			// 		return ((file as Object).hasOwnProperty('error'))
			// 	});

			// 	if (filesReadyToUpload && filesReadyToUpload.length) {
			// 		let attachment = filesReadyToUpload;

			// 		this._chatService.SendAttachment(this.currentConversation.sessionid, {
			// 			from: this.agent.nickname,
			// 			to: this.currentConversation.sessionid,
			// 			body: attachment,
			// 			cid: this.currentConversation._id,
			// 			attachment: true,
			// 			form: this.actionForm
			// 		}, this.files[0].name);

			// 		this.uploading = false;
			// 		filesReadyToUpload.forEach(x => {
			// 			this.arrToDialog.splice(x, 1);
			// 		});
			// 		if (!this.arrToDialog.length) {

			// 			this._chatService.ShowAttachmentAreaDnd.next(false);
			// 			this.arrToDialog = [];
			// 			this.files = [];
			// 			this.fileerror = '';

			// 		}

			// 	}
			// 	//when there is no media service or all wrong files..
			// 	else if ((this.file && this.file.length) || (filesReadyToUpload && filesReadyToUpload.length)) {

			// 		this.file.map(errors => {

			// 			this._uploadingService.ShowAttachmentError(errors.error).subscribe(fileerror => {
			// 				this.fileerror = fileerror;
			// 				if (errors.error) {
			// 					this.fileValid = false;
			// 					this.uploading = false;
			// 					this.fileInput.nativeElement.value = '';
			// 					this.ClearFile();
			// 				}
			// 			}, err => {
			// 				this.fileValid = false;
			// 				this.fileerror = "Error in uploading..Please try again!"
			// 				this.uploading = false;
			// 				console.log("error in showAttachment", err);

			// 			});
			// 		});
			// 	}

			// }, err => {
			// 	console.log("file not sent", err);
			// });
		}
		// if (this.autoGrowSyncMsgBody.trim() || (this.actionForm && this.actionForm.length)) {
		if (this.msgBody.trim()) {
			this._chatService.SendMessage(conversation, {
				from: this.agent.nickname,
				to: conversation.sessionid,
				body: this.msgBody.trim(),
				cid: conversation._id,
				form: this.actionForm
			});
			this.msgBody = '';
			// this.autoGrowSyncMsgBody = '';
		}
		this._chatService.SendTypingEventRest({ state: false, conversation: conversation }).subscribe(data => {
			this._chatService.tempTypingState.next(false)

		})
		// this.files = [];
		this._chatService.setAutoScroll(true);
		this._chatService.conversationSeen();

		if (this.files && !this.files.length && this.actionForm) {
			// this.ShowAttachmentAreaDnd = false;
			this._chatService.ShowAttachmentAreaDnd.next(false);
			this.actionForm = ''
		}
		setTimeout(() => {
			let event = new KeyboardEvent("keydown", {
				shiftKey: false,
				bubbles: true,
				cancelable: false,
				key: "Enter",
			});
			if (this.messageTextArea && this.messageTextArea.nativeElement) {
				(this.messageTextArea.nativeElement as HTMLElement).dispatchEvent(event);
				this.messageTextArea.nativeElement.focus();
			}
		}, 0);

		//for Action Forms
		// if (this.files && !this.files.length && this.actionForm) {
		// 	// this.ShowAttachmentAreaDnd = false;
		// 	this._chatService.ShowAttachmentAreaDnd.next(false);
		// 	this.actionForm = ''
		// }


	}

	// public SendMessage() {
	// 	if (this.files && this.files.length && !this.uploading) {
	// 		this.uploading = true;
	// 		this._uploadingService.GenerateLinksForTickets(this.files, 0, this.links).subscribe(response => {
	// 			let attachment = response;
	// 			////console.log(attachment);

	// 			this._chatService.SendAttachment(this.currentConversation.sessionid, {
	// 				from: this.agent.nickname,
	// 				to: this.currentConversation.sessionid,
	// 				body: attachment,
	// 				cid: this.currentConversation._id,
	// 				attachment: true,
	// 			}, this.files[0].name)
	// 			this.msgBody = '';
	// 			this.ShowAttachmentAreaDnd = false;
	// 			this.files = [];
	// 			this.arrToDialog = [];
	// 			this.links = [];
	// 			this.fileInput.nativeElement.value = '';
	// 			this.uploading = false;
	// 		}, err => {
	// 			this._uploadingService.ShowAttachmentError(JSON.parse(err)).subscribe(fileerror => {
	//                 //console.log(fileerror);
	//                 this.fileerror = fileerror;
	//                 if (err) {
	//                     this.uploading = false;
	//                     this.fileValid = false;
	//                     setTimeout(() => [
	//                         this.ShowAttachmentAreaDnd = false,
	//                         this.fileValid = true
	//                     ], 4500);
	//                     this.ClearFile();
	//                 }
	//             }, err => {
	//             });

	// 		});
	// 	}
	// 		if (this.msgBody.trim()) {

	// 			this._chatService.SendMessage(this.currentConversation.sessionid, {
	// 				from: this.agent.nickname,
	// 				to: this.currentConversation.sessionid,
	// 				body: this.msgBody.trim(),
	// 				cid: this.currentConversation._id
	// 			});
	// 			this.msgBody = '';

	// 			////console.log("typing event");

	// 			this._chatService.SendTypingEventRest({ state: false, conversation: this.currentConversation }).subscribe(data => {
	// 				this._chatService.tempTypingState.next(false)
	// 			})
	// 			// this.files = [];
	// 			this._chatService.setAutoScroll(true);
	// 			this._chatService.conversationSeen();
	// 		}
	// }

	// public SendMessage() {
	// 	if (this.files && this.files.length && !this.uploading) {
	// 		this.uploading = true;
	// 		this._uploadingService.GenerateLinksForTickets(this.files, 0, this.links).subscribe(response => {
	// 			let attachment = response;
	// 			this._chatService.SendAttachment(this.currentConversation.sessionid, {
	// 				from: this.agent.nickname,
	// 				to: this.currentConversation.sessionid,
	// 				body: attachment,
	// 				cid: this.currentConversation._id,
	// 				attachment: true,
	// 				form: this.actionForm
	// 			}, this.files[0].name)
	// 			this.msgBody = '';
	// 			this.ShowAttachmentAreaDnd = false;
	// 			this.files = [];
	// 			this.arrToDialog = [];
	// 			this.links = [];
	// 			this.fileInput.nativeElement.value = '';
	// 			this.uploading = false;
	// 		}, err => {
	// 			this._uploadingService.ShowAttachmentError(JSON.parse(err)).subscribe(fileerror => {
	// 				//console.log(fileerror);
	// 				this.fileerror = fileerror;
	// 				if (err) {
	// 					this.uploading = false;
	// 					this.fileValid = false;
	// 					setTimeout(() => [
	// 						this.ShowAttachmentAreaDnd = false,
	// 						this.fileValid = true
	// 					], 4500);
	// 					this.ClearFile();
	// 				}
	// 			}, err => {
	// 			});

	// 		});
	// 	}
	// 	if (this.msgBody.trim()) {

	// 		this._chatService.SendMessage(this.currentConversation.sessionid, {
	// 			from: this.agent.nickname,
	// 			to: this.currentConversation.sessionid,
	// 			body: this.msgBody.trim(),
	// 			cid: this.currentConversation._id,
	// 			form: this.actionForm
	// 		});
	// 		this.msgBody = '';

	// 		////console.log("typing event");

	// 		this._chatService.SendTypingEventRest({ state: false, conversation: this.currentConversation }).subscribe(data => {
	// 			this._chatService.tempTypingState.next(false)
	// 		})
	// 		// this.files = [];
	// 		this._chatService.setAutoScroll(true);
	// 		this._chatService.conversationSeen();
	// 		//for Action Forms
	// 		if (this.files && !this.files.length && this.actionForm) {
	// 			this.ShowAttachmentAreaDnd = false;
	// 			this.actionForm = ''
	// 		}
	// 	}
	// }

	// public FileSelected(event: Event) {

	// 	this._chatService.ShowAttachmentAreaDnd.next(false);
	// 	// this.fileValid = true;
	// 	for (let i = 0; i < this.fileInput.nativeElement.files.length; i++) {
	// 		if (this.fileInput.nativeElement.files.length > 0) {
	// 			this.files = this.files.concat(this.fileInput.nativeElement.files[i]);
	// 		}
	// 	}
	// 	this.readURL(this.files).subscribe(response => {
	// 		if (response.status == 'ok') {
	// 			this._chatService.ShowAttachmentAreaDnd.next(true);

	// 		}
	// 	});

	// 	setTimeout(() => {
	// 		// this._chatService.setDraftFiles(this.currentConversation._id, this.files, this.arrToDialog);
	// 	}, 0);

	// }

	public FileSelected(event: Event) {
		this._chatService.ShowAttachmentAreaDnd.next(false);
		for (let i = 0; i < this.fileInput.nativeElement.files.length; i++) {
			if (this.fileInput.nativeElement.files.length > 0) {
				this.files.push(this.fileInput.nativeElement.files[i]);
			}
		}
		this.readURL(this.files).subscribe(response => {
			if (response.status == 'ok') {
				this._chatService.ShowAttachmentAreaDnd.next(true);
				//	if (!this.uploading) this._chatService.setDraftFiles(this.currentConversation._id, this.files, this.currentConversation.arrToDialog);
			}
		});

		// setTimeout(() => {
		// 	this._chatService.setDraftFiles(this.currentConversation._id, this.files, this.arrToDialog);
		// }, 0);
		console.log(this.arrToDialog, this.files);
	}

	public ClearFile() {
		this.file = undefined;
		this.files = [];
		this.fileInput.nativeElement.value = '';
	}

	RemoveFile(data) {
		this.arrToDialog.forEach((e, i) => {
			if (e.file.name == data.file.name) {
				this.arrToDialog.splice(i, 1);
			}
		});

		this.files.forEach((e, i) => {
			if (e.name == data.file.name) {
				this.files.splice(i, 1);
			}
		});

		this.fileInput.nativeElement.value = '';

		if (!this.arrToDialog.length) {
			this.ShowAttachmentAreaDnd = false;
		}
	}





	onClear(event) {

		if (event.clearActionForm) {
			this.actionForm = ''
			if (this.files && !this.files.length) this._chatService.ShowAttachmentAreaDnd.next(false);
		}
		else if (event.clearAll) {
			this.fileInput.nativeElement.value = '';
			this._chatService.ShowAttachmentAreaDnd.next(false);
			this.uploading = false;
			this.fileValid = false;
			this.files = [];
		} else if (event.fileToRemove) {
			let index = this.files.findIndex(w => w.name == event.fileToRemove.name);
			if (index != -1) {
				this.files.splice(index, 1);
			}
		}
		// if (event.clear) {
		// 	if (this.fileInput) this.fileInput.nativeElement.value = '';
		// 	//this.files = [];
		// 	this.fileerror = '';
		// 	//this._chatService.ShowAttachmentAreaDnd.next(false);
		// 	this.uploading = false;
		// 	this.fileValid = false;
		// 	// if (this.currentConversation.attachments) {
		// 	// 	this.currentConversation.attachments = []
		// 	// 	this.currentConversation.arrToDialog = []
		// 	// }
		// }
		// else if (event.clearActionForm) {
		// 	this.actionForm = ''
		// 	// this.ShowAttachmentAreaDnd = false
		// 	this._chatService.ShowAttachmentAreaDnd.next(false);

		// }
	}


	//DRAG AND DROP FUNCTIONS

	public OnDragOver(event) {

		if (Object.keys(this.currentConversation).length && this.currentConversation.state != 2) return false;
		this.isDragged = true;

		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation();

	}

	public onDragLeave(event) {

		if (Object.keys(this.currentConversation).length && this.currentConversation.state != 2) return false;
		this.isDragged = false;

		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation();
	}

	public onDrop(event) {

		if (Object.keys(this.currentConversation).length && this.currentConversation.state != 2) return false;
		this.isDragged = false;

		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation();

		this._chatService.ShowAttachmentAreaDnd.next(false);
		this.fileValid = true;
		if (event.dataTransfer.items) {
			for (let i = 0; i < event.dataTransfer.items.length; i++) {
				if (event.dataTransfer.items[i].kind === "file") {
					let file = event.dataTransfer.items[i].getAsFile();
					this.files = this.files.concat(file);
				}
			}
		}
		this.readURL(this.files).subscribe(response => {
			if (response.status == 'ok') {
				this._chatService.ShowAttachmentAreaDnd.next(true);
				// this._chatService.setDraftFiles(this.currentConversation._id, this.files, this.arrToDialog);

			}
		});
		setTimeout(() => {
			// this._chatService.setDraftFiles(this.currentConversation._id, this.files, this.arrToDialog);
			// this._chatService.ShowAttachmentAreaDnd.next(true);
		}, 0);

	}

	// readURL(files) {


	// 	this.arrToDialog = [];
	// 	// ////console.log(files);
	// 	if (files && files.length) {

	// 		for (let i = 0; i < files.length; i++) {
	// 			this.arrToDialog = [];

	// 			let file = files[i];

	// 			// if (!file.type.match('image')) continue;
	// 			let picReader = new FileReader();
	// 			this.arrToDialog = [];

	// 			picReader.addEventListener("load", (event: any) => {
	// 				this.imagetarget = event.target.result;

	// 				// ////console.log(this.imagetarget);
	// 				let obj = { url: this.imagetarget, file: files[i] };
	// 				this.arrToDialog.push(obj);
	// 				//console.log(this.arrToDialog);
	// 			});

	// 			picReader.readAsDataURL(file);
	// 		}

	// 	}
	// }


	//VoiceNotes


	readURL(files): Observable<any> {
		return new Observable((observer) => {
			this.attachmentGallery = [];
			this._uploadingService.readURL(files).subscribe(data => {
				if (data) {
					this.attachmentGallery = data;
					observer.next({ status: 'ok' });
					observer.complete();
				}
			})
		});
	}

	startRecording() {
		this.isAudioSent = false;
		this.recordingStarted = true;
		navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
			this.mediaStream = stream;
			this.recordRTC = RecordRTC(stream, {
				type: 'audio'
			});


			this.recordRTC.startRecording();
			this.recordingInterval = setInterval(() => {
				this.seconds++;
				if (this.seconds == 60) {
					this.mins += 1;
					this.stopRecording();
					clearInterval(this.recordingInterval);
				}
			}, 1000);
		}).catch((err) => {
			console.log("Error", err);
		});
	}
	cancelRecording() {
		this.seconds = 0;
		this.mins = 0;
		this.recordingStarted = false;
		this.recordRTC.stopRecording(() => {
			this.mediaStream.getTracks()[0].stop();
			this.isAudioSent = false;
			clearInterval(this.recordingInterval);
		});
	}
	stopWithTimeout() {
		if (!this.isAudioSent) {
			this.seconds = 0;
			this.mins = 0;
			this.recordingStarted = false;
			this.loading = true;
			this.recordRTC.stopRecording(() => {
				// let recording = this.recordRTC.getBlob();
				this._uploadingService.getSeekableBlob(this.recordRTC.getBlob(), (blob) => {
					this.recordedFile = new File([blob], ('stream' + new Date().getTime() + '.mp3'), { type: 'audio/webm' });
					clearInterval(this.recordingInterval);
				});
			});
		}
	}


	public TryCall(selectedVisitor: any) {

		event.preventDefault();
		this.dialog.open(CallDialogComponent, {
			panelClass: ['calling-dialog'],
			data: selectedVisitor,
			disableClose: true,
			autoFocus: true
		}).afterClosed().subscribe(response => {
			// ////console.log(response);
			this._callingService.EndCall();
		});



	}

	public isArray(obj: any) {
		return Array.isArray(obj)
	}

	Emoji($event) {
		//////console.log($event);
		this.msgBody += $event;
		this.EmojiWrapper = false;
	}

	ngOnDestroy() {
		//  ////console.log('Destroyed');
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
	}

}
