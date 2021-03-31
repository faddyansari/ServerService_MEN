import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild, HostListener } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { GlobalStateService } from '../../../../services/GlobalStateService';
import { AgentService } from '../../../../services/AgentService';
import { AuthService } from '../../../../services/AuthenticationService';
import { UploadingService } from '../../../../services/UtilityServices/UploadingService';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

var RecordRTC = require('recordrtc');

@Component({
    selector: 'app-agents-chat',
    templateUrl: './agents-chat.component.html',
    styleUrls: ['./agents-chat.component.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class AgentsChatComponent implements OnInit {

    @ViewChild('fileInput') fileInput: ElementRef;
    @ViewChild('scrollContainer') ScrollContainer: ElementRef;
    @ViewChild('messageTextArea') messageTextArea: ElementRef;
    CheckViewChange: Subject<any> = new Subject();

    agent: any;
    imagetarget: any;
    subscription: Subscription[] = [];
    attachmentGallery = [];
    files = [];
    ShowAttachmentAreaDnd = false;
    isDragged = false;
    autoscroll = true;
    msgBody = '';
    uploading = false;
    scrollHeight = 0;
    scrollTop: number = 10;
    fileValid = true;
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
    fetchedNewMessages = false;
    EmojiWrapper: boolean = false;
    //Call Record
    mediaStream: MediaStream;
    recordRTC: any;
    seconds: number = 0;
    mins: number = 0;
    recordingStarted = false;
    isAudioSent = false;
    recordingInterval: any;
    recordedFile: any;
    loading = false;
    selectedAgentConversation: any;
    agentLastSeen: any;
    isSelfViewingChat: any;
    restrictAutoSize = true;
    fileSharePermission = true;
    constructor(private _appStateService: GlobalStateService,
        private _agentService: AgentService,
        _authService: AuthService,
        private _uploadingService: UploadingService,
        public dialog: MatDialog,
        public snackBar: MatSnackBar) {

        this.subscription.push(_authService.getAgent().subscribe(agent => {
            this.agent = agent;
        }));

        this.subscription.push(_agentService.selectedAgentConversation.subscribe(agentConversation => {
            if (Object.keys(agentConversation).length) {
                this.selectedAgentConversation = agentConversation;
                if (agentConversation && agentConversation.length) {
                    this.agentLastSeen = this.selectedAgentConversation.LastSeen.filter(obj => obj.id == (agentConversation.to == this.agent.email) ? agentConversation.from : agentConversation.to)[0].DateTime;
                }
            }
            if (agentConversation && (agentConversation as Object).hasOwnProperty('_id')) {
                this.restrictAutoSize = false
            }
        }));
        this.subscription.push(_agentService.isSelfViewingChat.subscribe(data => {
            this.isSelfViewingChat = data;
        }));

        this.subscription.push(_agentService.ShowAttachmentAreaDnd.subscribe(data => {
            this.ShowAttachmentAreaDnd = data;
        }));

        this.subscription.push(this.CheckViewChange.debounceTime(100).subscribe(data => {
            // console.log('Check View change');
            
            if (this.ScrollContainer.nativeElement.scrollHeight != this.scrollHeight) {
                this.scrollHeight = this.ScrollContainer.nativeElement.scrollHeight;
                if (this.autoscroll) {
                    this.scrollToBottom();
                }
            }
        }));


        // this.onMessageInput
        //     .map(event => event)
        //     .debounceTime(1000)
        //     .switchMap(() => {
        //         // console.log("Paused!");
        //         if (!this.msgBody.length) {
        //             return new Observable((observer) => {

        //                 observer.complete();
        //             });
        //         }
        //     }).subscribe();

    }

    private scrollToBottom(): void {
        // console.log(this.autoscroll);

        if (!this.autoscroll) {
            return
        }
        try {
            // console.log('Scroll to bottom');

            this.ScrollContainer.nativeElement.scrollTop = this.ScrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }


    public OpenViewHistory() {
        this._agentService.closeDetail.next(true);
    }

    ScrollbarChanged(event: UIEvent) {
        // this.scrollTop = this.ScrollContainer.nativeElement.scrollTop;
        if (((event.target as HTMLElement).scrollTop + (event.target as HTMLElement).clientHeight) >= this.ScrollContainer.nativeElement.scrollHeight) {

            if (this.autoscroll != true) {
                this.autoscroll = true;
            }
        } else if (this.ScrollContainer.nativeElement.scrollTop <= 0 && this.ScrollContainer.nativeElement.scrollHeight > 0) {

            this.fetchedNewMessages = true;
            let oldScrollHeight = (event.target as HTMLElement).scrollHeight;
            this.subscription.push(this._agentService.GetMoreMessages(this.selectedAgentConversation._id, this.selectedAgentConversation.messages[0]._id, (this.agent.email) ? this.agent.email : '').subscribe(data => {
                setTimeout(() => {
                    this.ScrollContainer.nativeElement.scrollTop = this.ScrollContainer.nativeElement.scrollHeight - oldScrollHeight;
                }, 0);

            }))

        } else {
            this.autoscroll = false;
        }
        // this.scrollHeight = this.ScrollContainer.nativeElement.scrollHeight;

    }

    ngOnInit() {

    }
    ngAfterViewInit() {
        this.scrollToBottom();
    }
    ngAfterViewChecked() {
        this.CheckViewChange.next(true);
    }
    ngOnDestroy() {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        this.subscription.forEach(subscription => {
            subscription.unsubscribe();
        });

        this._appStateService.CloseControlSideBar();
    }

    //DRAG AND DROP FUNCTIONS

    public OnDragOver(event) {
        // if (event.dataTransfer.items.length > 1) return false;
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        this.isDragged = true;

    }

    public onDragLeave(event) {
        // if (event.dataTransfer.items.length > 1) return false;
        this.isDragged = false;

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
    }


    public onDrop(event) {
        // if (event.dataTransfer.items.length > 1) return false;
        event.preventDefault();
        // event.stopPropagation();
        event.stopImmediatePropagation();

        this.isDragged = false;
        this._agentService.ShowAttachmentAreaDnd.next(false);
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

            }
        });
        setTimeout(() => {
            this._agentService.ShowAttachmentAreaDnd.next(true);
        }, 0);
        // this._agentService.setDraft(this.selectedAgentConversation._id, this.files,this.arrToDialog);

    }


    onClear(event) {
        if (event.clearAll) {
            this.fileInput.nativeElement.value = '';
            this._agentService.ShowAttachmentAreaDnd.next(false);
            this.uploading = false;
            this.fileValid = false;
            this.files = [];
        } else {
            let index = this.files.findIndex(w => w.name == event.fileToRemove.name);
            if (index != -1) {
                this.files.splice(index, 1);
            }
        }
    }

    keydown(event: KeyboardEvent) {
        if (event.key == 'Enter' && event.shiftKey) {
        }
        else if (event.key == 'Enter' && !event.shiftKey) {
            this.SendMessage(event);
            return false
        }
    }

    SendMessageSingleAttach(file) {
        // console.log('Sending file...' + file.name);
        let galleryIndex = this.attachmentGallery.findIndex(w => w.name == file.name);
        if (galleryIndex != -1) {
            this.attachmentGallery[galleryIndex].uploading = true;
        }
        this._uploadingService.GenerateLinksForFiles(file, 'SendAttachMent').subscribe(response => {
            if (response) {
                if (!response.error) {
                    let message: any = {
                        to: (this.selectedAgentConversation.type == 'single') ? this.selectedAgentConversation.members.filter(m => m.email != this.agent.email).map(a => a.email) : [],
                        from: this.agent.email,
                        replyto: [],
                        type:'Agents',
                        viewColor: this.selectedAgentConversation.members.filter(m => m.email == this.agent.email)[0].viewColor,
                        body: [response],
                        cid: this.selectedAgentConversation._id,
                        attachment: true
                    }
                    this._agentService.SendMessageToAgent(message);
                    // this.uploading = false;
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
            // console.log("file not sent", err);
            let ind = this.attachmentGallery.findIndex(w => w.name == file.name);
            if (ind != -1) {
                this.attachmentGallery[ind].uploading = false;
                this.attachmentGallery[ind].error = 'error in uploading';
            }
        });
    }

    SendMessage(event) {
        // if (event.which == 1) {
        //     let ev = new KeyboardEvent("keydown", {

        //         shiftKey: false,
        //         bubbles: true,
        //         cancelable: false,
        //         code: "Enter",
        //         composed: true,
        //         key: "Enter",
        //         view: window,
        //     });
        //     let result = (this.messageTextArea.nativeElement as HTMLElement).dispatchEvent(ev);
        //     this.keydown((ev as KeyboardEvent));
        //     setTimeout(() => {
        //         result = (this.messageTextArea.nativeElement as HTMLElement).dispatchEvent(ev);
        //         this.messageTextArea.nativeElement.focus();
        //     }, 0);
        // }
        if (this.files && this.files.length && !this.uploading) {
            // this.uploading = true;
            this.files.map((file) => {
                this.SendMessageSingleAttach(file);
            });
            this.fileInput.nativeElement.value = '';
            this.msgBody = '';
        } else {
            if (this.msgBody.trim()) {
                let message: any = {
                    to: (this.selectedAgentConversation.type == 'single') ? this.selectedAgentConversation.members.filter(m => m.email != this.agent.email).map(a => a.email): [],
                    from: this.agent.email,
                    replyto: [],
                    type:'Agents',
                    viewColor: this.selectedAgentConversation.members.filter(m => m.email == this.agent.email)[0].viewColor,
                    body: this.msgBody.trim(),
                    cid: this.selectedAgentConversation._id,
                    date: new Date().toISOString()
                }
                this._agentService.SendMessageToAgent(message);
                this.msgBody = '';
            }

            this.autoscroll = true;
            this.scrollToBottom();
        }
    }

    public ClearFile() {
        this.files = [];
        this.fileInput.nativeElement.value = '';
    }
    public FileSelected(event: Event) {
        this._agentService.ShowAttachmentAreaDnd.next(false);
        this.files = this.files.filter(f => !f.error);
        // this.fileInput.nativeElement.files = this.fileInput.nativeElement.files.filter(f => !f.hasOwnProperty('error'));
        for (let i = 0; i < this.fileInput.nativeElement.files.length; i++) {
            this.files.push(this.fileInput.nativeElement.files[i]);
        }
        this.readURL(this.files).subscribe(response => {
            if (response.status == 'ok') {
                this._agentService.ShowAttachmentAreaDnd.next(true);
            }
        });
    }
    readURL(files): Observable<any> {
        // console.log(files);

        return new Observable((observer) => {
            this.attachmentGallery = [];
            if (files && files.length) {
                files.map(file => {

                    let picReader = new FileReader();
                    this.attachmentGallery = [];

                    picReader.addEventListener("load", (event: any) => {
                        this.imagetarget = event.target.result;
                        let obj = { url: this.imagetarget, name: file.name, uploading: false, error: '' };
                        this.attachmentGallery.push(obj);
                        observer.next({ status: 'ok' });
                        observer.complete();
                    });

                    picReader.readAsDataURL(file);

                })
            }
        });
    }
    //VoiceNotes
    startRecording() {
        this.isAudioSent = false;
        this.recordingStarted = true;
        navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
            this.mediaStream = stream;
            this.recordRTC = RecordRTC(stream, {
                type: 'audio'
            });
            // console.log('Start Recording');

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
                // let recording = this.recordRTC.getBlob();
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
                                            to: (this.selectedAgentConversation.type == 'single') ? this.selectedAgentConversation.members.filter(m => m.email != this.agent.email).map(a => a.email): [],
                                            from: this.agent.email,
                                            replyto: [],
                                            type:'Agents',
                                            viewColor: this.selectedAgentConversation.members.filter(m => m.email == this.agent.email)[0].viewColor,
                                            body: [{ filename: file.name, path: json.response.PostResponse.Location[0] }],
                                            cid: this.selectedAgentConversation._id,
                                            attachment: true,
                                            filename: file.name
                                        }
                                        this._agentService.SendMessageToAgent(message);
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
                })
                // let recording  = this.recordRTC.getBlob();             
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
                                to: (this.selectedAgentConversation.type == 'single') ? this.selectedAgentConversation.members.filter(m => m.email != this.agent.email).map(a => a.email): [],
                                from: this.agent.email,
                                replyto: [],
                                type:'Agents',
                                viewColor: this.selectedAgentConversation.members.filter(m => m.email == this.agent.email)[0].viewColor,
                                body: json.response.PostResponse.Location[0],
                                cid: this.selectedAgentConversation._id,
                                attachment: true,
                                filename: this.recordedFile.name
                            }
                            this._agentService.SendMessageToAgent(message);
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
        // console.log('Stop Recording');

    }

    displayMessageArea() {
        if (this.selectedAgentConversation && this.selectedAgentConversation.members.filter(m => m.email == this.agent.email).length) {
            return true;
        } else {
            return false;
        }
    }

    Emoji($event) {
        console.log($event);
        this.msgBody += $event;
        this.EmojiWrapper = false;
    }
}