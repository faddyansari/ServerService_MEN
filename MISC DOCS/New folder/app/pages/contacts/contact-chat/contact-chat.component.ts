import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild, HostListener } from '@angular/core';
import { Contactservice } from '../../../../services/ContactService';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../../../services/AuthenticationService';
//#Change To Native Scroll Bar
import { UploadingService } from '../../../../services/UtilityServices/UploadingService';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

var RecordRTC = require('recordrtc');

@Component({
	selector: 'app-contact-chat',
	templateUrl: './contact-chat.component.html',
	styleUrls: ['./contact-chat.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ContactChatComponent implements OnInit {

	@ViewChild('fileInput') fileInput: ElementRef;
	@ViewChild('scrollContainer') ScrollContainer: ElementRef;
	CheckViewChange: Subject<any> = new Subject();
	autoscroll = false;


	agent: any;

	subscriptions: Subscription[] = [];
	fileValid = true;
	automatedMessagesList = [];
	filteredAutomatedMessages = [];
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
	shiftdown = false;
	hashQuery = '';
	hashIndex = -1;
	msgBody = '';
	file: any = undefined;
	scrollHeight = 0;
	scrollTop: number = 10;
	fetchedNewMessages = false;
	fileSharePermission = true;
	uploading = false;
	isContactViewingChat: any;
	isSelfViewingChat: any;
	EmojiWrapper: boolean = false;
	//Call Record
	mediaStream: MediaStream;
	recordRTC: any;
	seconds: number = 0;
	mins: number = 0;
	recordingStarted = false;
	isAudioSent = false;
	recordingInterval: any;
	//Revamp work
	selectedThread: any;
	selectedContact: any;
	contactLastSeen: any;
	recordedFile: any;
	loading = false;
	loadingConversation = false;
	showContactInfo = false;
	public onMessageInput = new Subject();
	typingState = true;

	constructor(private _contactService: Contactservice, private _authService: AuthService, private _uploadingService: UploadingService) {
		this.subscriptions.push(_authService.getAgent().subscribe(data => {
			this.agent = data;
		}));
		this.subscriptions.push(_contactService.selectedThread.subscribe(data => {
			if (data) {
				this.selectedThread = data;
			}
		}));
		this.subscriptions.push(_contactService.selectedContact.subscribe(data => {
			if (data) {
				this.selectedContact = data;
				// console.log(this.selectedContact);
			}
		}));
		this.subscriptions.push(_contactService.loadingConversation.subscribe(data => {
			this.loadingConversation = data;
		}));
		this.subscriptions.push(_contactService.showContactInfo.subscribe(data => {
			this.showContactInfo = data;
		}));
		this.subscriptions.push(_contactService.isSelfViewingChat.subscribe(data => {
			this.isSelfViewingChat = data;
		}));

		this.subscriptions.push(this.CheckViewChange.debounceTime(100).subscribe(data => {

			if (this.ScrollContainer.nativeElement.scrollHeight != this.scrollHeight) {
				this.scrollHeight = this.ScrollContainer.nativeElement.scrollHeight;
				if (this.autoscroll) {
					this.scrollToBottom();
				}
			}
		}));

		this.onMessageInput
			.map(event => event)
			.debounceTime(1000)
			.switchMap(() => {
				// console.log("Paused!");
				return new Observable((observer) => {
					this._contactService.PausedTyping(this.selectedThread._id.toString(), (this.selectedThread.to == this.agent.email) ? this.selectedThread.from : this.selectedThread.to, this.agent.email);
					this.typingState = true;
					observer.complete();
				});
			}).subscribe();

	}

	private scrollToBottom(): void {
		if (this.autoscroll != true) {
			return
		}
		try {
			this.ScrollContainer.nativeElement.scrollTop = this.ScrollContainer.nativeElement.scrollHeight;
		} catch (err) { }
	}

	ScrollChanged(event: UIEvent) {
		this.scrollTop = this.ScrollContainer.nativeElement.scrollTop;
		if (((event.target as HTMLElement).scrollTop + (event.target as HTMLElement).clientHeight) >= this.ScrollContainer.nativeElement.scrollHeight) {

			if (this.autoscroll != true) {
				this.autoscroll = true;
			}
		} else if (this.scrollTop <= 0 && this.ScrollContainer.nativeElement.scrollHeight > 0) {
			this.fetchedNewMessages = true;
			this._contactService.GetMoreMessages(this.selectedThread._id, this.selectedThread.messages[0]._id);
		} else {
			this.autoscroll = false;
		}
		this.scrollHeight = this.ScrollContainer.nativeElement.scrollHeight;

	}

	ngOnInit() {

	}

	ngAfterViewInit() {

		this.scrollToBottom();
	}
	ngAfterViewChecked() {
		this.CheckViewChange.next(true);

		// if (this.scrollRef && this.scrollRef.view.scrollHeight != this.scrollHeight) {
		// 	if (this.fetchedNewMessages) {
		// 		this.scrollRef.scrollYTo(this.scrollRef.view.scrollHeight - this.scrollHeight, 10);
		// 		this.fetchedNewMessages = false;
		// 		this.scrollHeight = this.scrollRef.view.scrollHeight;
		// 	} else {
		// 		this.scrollHeight = this.scrollRef.view.scrollHeight;
		// 		this.scrollRef.scrollYTo(this.scrollHeight);
		// 	}
		// }
	}

	filterInput(autocompleteString: string) {


		this.filteredAutomatedMessages = this.automatedMessagesList.filter(automatedMessage => {

			if (automatedMessage.hashTag.indexOf(autocompleteString) != -1 && autocompleteString) {
				return automatedMessage;

			}
		})

	}

	clearinputFilter() {
		this.hashQuery = '';
		this.hashIndex = -1;
	}

	public setShift() {
		this.shiftdown = false;
		this.clearinputFilter();
	}

	keydown(event: KeyboardEvent) {
		switch (event.key.toLowerCase()) {
			case 'enter':
				if (!this.msgBody && !this.shiftdown) {
					event.preventDefault();
				}
				break;
			case 'shift':
				this.shiftdown = true;
				break;
		}
	}

	keyup(event: KeyboardEvent) {
		// console.log('Typing State');
		if (this.typingState && this.msgBody.length && event.key.toLowerCase() != "control" && event.key.toLowerCase() != "backspace" && event.key.toLowerCase() != "shift") {
			// console.log('User is Typing...');
			this._contactService.StartedTyping(this.selectedThread._id.toString(), (this.selectedThread.to == this.agent.email) ? this.selectedThread.from : this.selectedThread.to, this.agent.email);
			this.typingState = false;
		}
		if (this.hashQuery) {

			switch (event.key.toLowerCase()) {
				case 'backspace':
					{
						if (this.msgBody.length <= this.hashIndex) {
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
						this.clearinputFilter();
						break;
					}
			}

		} else {
			switch (event.key.toLowerCase()) {
				case 'enter':
					{
						if (this.shiftdown) {
							event.preventDefault();
						} else {
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


	keyPress(event: KeyboardEvent) {
		if (event.key == '#') {
			this.hashQuery = '#';
			this.hashIndex = this.msgBody.length;
		} else if (this.hashQuery) {
			this.hashQuery += event.key;
		}

	}

	SendMessage() {

		if (this.file && !this.uploading) {
			this.uploading = true;
			this._uploadingService.SignRequest(this.file, 'SendAttachMent').subscribe(response => {
				let params = JSON.parse(response.text());
				params.file = this.file
				this._uploadingService.uploadAttachment(params).subscribe(s3response => {
					// console.log(s3response.status);
					if (s3response.status == '201') {
						this._uploadingService.parseXML(s3response.text()).subscribe(json => {
							//console.log(json.response.PostResponse.Location[0])

							let message: any = {
								to: (this.selectedThread.to == this.agent.email) ? this.selectedThread.from : this.selectedThread.to,
								from: this.agent.email,
								body: json.response.PostResponse.Location[0],
								cid: this.selectedThread._id,
								attachment: true,
								filename: this.file.name
							}
							this._contactService.SendMessageToContact(message);
							this.file = '';
							this.fileInput.nativeElement.value = '';
							this.msgBody = '';
							this.uploading = false;
						}, err => {
							this.uploading = false;
						});
					}

				}, err => {
					this.uploading = false;
				});
			}, err => {

				this.uploading = false;
				this.fileValid = false;
				setTimeout(() => [
					this.fileValid = true
				], 3000);
				this.ClearFile();

			});
		} else {
			if (this.msgBody.trim()) {
				let message: any = {
					to: (this.selectedThread.to == this.agent.email) ? this.selectedThread.from : this.selectedThread.to,
					from: this.agent.email,
					body: this.msgBody.trim(),
					cid: this.selectedThread._id
				}
				// console.log(message.date);
				this._contactService.SendMessageToContact(message);
				// this._contactService.SendMessageToContact(message, false);
				// this.selectedThread.messages.push(message);
				this.msgBody = '';
			} else {
				// this.msgBody = '';
			}

		}
	}
	public ClearFile() {
		this.file = undefined
		this.fileInput.nativeElement.value = '';

	}

	public FileSelected(event: Event) {
		this.fileValid = true;
		document.getElementsByName("message")[0].focus();
		if ((<HTMLInputElement>event.target).files[0].type) {

			if ((<HTMLInputElement>event.target).files.length > 0) {
				this.file = (<HTMLInputElement>event.target).files[0];
				return;
			}

		} else {
			this.fileValid = false;
			this.ClearFile();

			setTimeout(() => [
				this.fileValid = true
			], 3000);

		}
		this.file = undefined;
		return;
	}

	startRecording() {
		this.isAudioSent = false;
		this.recordingStarted = true;
		navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
			this.mediaStream = stream;
			this.recordRTC = RecordRTC(stream, {
				type: 'audio',
			});
			console.log('Start Recording');

			this.recordRTC.startRecording();
			this.recordingInterval = setInterval(() => {
				this.seconds++;
				if (this.seconds == 60) {
					this.mins += 1;
					this.stopWithTimeout();
					clearInterval(this.recordingInterval);
				}
			}, 1000);
		}).catch((err) => {
			// console.log(err);
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
				this._uploadingService.getSeekableBlob(this.recordRTC.getBlob(), (blob) => {
					this.recordedFile = new File([blob], ('stream' + new Date().getTime() + '.mp3'), { type: 'audio/webm' });
					clearInterval(this.recordingInterval);
				})
			});
		}
	}
	stopRecording() {
		if (!this.isAudioSent && !this.recordedFile) {
			this.seconds = 0;
			this.mins = 0;
			this.recordingStarted = false;
			this.loading = true;
			this.recordRTC.stopRecording(() => {
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
										let message: any = {
											to: (this.selectedThread.to == this.agent.email) ? this.selectedThread.from : this.selectedThread.to,
											from: this.agent.email,
											body: json.response.PostResponse.Location[0],
											cid: this.selectedThread._id,
											attachment: true,
											filename: file.name
										}
										this._contactService.SendMessageToContact(message);
										this.fileInput.nativeElement.value = '';
										this.uploading = false;
										this.loading = false;
										this.mediaStream.getTracks()[0].stop();
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
							let message: any = {
								to: (this.selectedThread.to == this.agent.email) ? this.selectedThread.from : this.selectedThread.to,
								from: this.agent.email,
								body: json.response.PostResponse.Location[0],
								cid: this.selectedThread._id,
								attachment: true,
								filename: this.recordedFile.name
							}
							this._contactService.SendMessageToContact(message);
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
		console.log('Stop Recording');
	}

	ToggleInfo() {
		// this.showAgentInfo = !this.showAgentInfo;
		if (Object.keys(this.selectedThread).length) {
			this._contactService.showContactInfo.next(!this.showContactInfo);
		}
	}
	Emoji($event) {
		console.log($event);
		this.msgBody += $event;
		this.EmojiWrapper = false;
	}

	setTypingState() {

	}

}


