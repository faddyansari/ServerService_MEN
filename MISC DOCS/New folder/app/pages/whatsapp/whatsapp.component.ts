import { Component, OnInit, ViewEncapsulation, HostListener, ViewChild, ElementRef } from '@angular/core';
import { WhatsAppService } from '../../../services/WhatsAppService';
import { Subscription } from 'rxjs/Subscription';
import { UploadingService } from '../../../services/UtilityServices/UploadingService';
import { Observable } from 'rxjs/Observable';
import { UtilityService } from '../../../services/UtilityServices/UtilityService';

var RecordRTC = require('recordrtc');


@Component({
  selector: 'app-whatsapp',
  templateUrl: './whatsapp.component.html',
  styleUrls: ['./whatsapp.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WhatsappComponent implements OnInit {

  subscriptions: Subscription[] = [];
  displayReady = false;
  contactList = [];
  searchList = [];
  tempSearchValue = '';
  selectedContact = undefined;
  customEmail = '';
  fetching = false;
  fetchingMessages = false;
  autoScroll = true;

  shiftdown = false;
  msgBody = '';

  uploading = false;
  attachmentGallery = [];
  uploadingCount: number = 0
  files = [];
  fileValid = true;
  ShowAttachmentAreaDnd = false;

  loadingContacts = false;
  _Searching = false;
  initialized = false;


  audioStarted = false;
  recordingInterval: NodeJS.Timer;
  mins: number = 0;
  recordRTC: any;
  mediaStream: MediaStream;
  seconds: number = 0;
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private _whatsAppService: WhatsAppService, private _uploadingService: UploadingService, private _utilityService :UtilityService) {

    // this.subscriptions.push(this._whatsAppService.canAccessWhatsApp.subscribe(data => {
    //   // console.log('Wshats app component', data);
    //   if (this._whatsAppService.authChecked.getValue()) {
    //     // console.log('Auth Checked', this._whatsAppService.authChecked.getValue());
    //     if (data) this.displayReady = true;
    //     else this._whatsAppService.Noaccess();
    //   }

    // }));

    this.subscriptions.push(this._whatsAppService.customEmail.subscribe(email => { this.customEmail = email }));


    this.subscriptions.push(this._whatsAppService.SearchList.subscribe(searchList => {
      // console.log('List Updated :', contactsList.length);
      this.searchList = searchList.sort((a, b) => {

        return (new Date(a.lastTouchedTime).getTime() - new Date(b.lastTouchedTime).getTime() > 0) ? -1 : 1

      });

    }));


    this.subscriptions.push(this._whatsAppService.SelectedContact.subscribe(selectedContact => {
      this.selectedContact = selectedContact;
      if (this.selectedContact && selectedContact._id != this.selectedContact && this.audioStarted) {
        this.CancelRecording();
      }
    }));

    this.subscriptions.push(this._whatsAppService.FetchingContacts.subscribe(data => {
      this.loadingContacts = data;
    }))

    this.subscriptions.push(this._whatsAppService.__Searching.subscribe(value => {
      this._Searching = value;
    }))


  }

  ngOnInit() {
    this.subscriptions.push(this._whatsAppService.canAccessWhatsApp.subscribe(data => {
      // console.log('Wshats app component', data);
      if (this._whatsAppService.authChecked.getValue()) {
        // console.log('Auth Checked', this._whatsAppService.authChecked.getValue());
        if (data) this.displayReady = true;
        else this._whatsAppService.Noaccess();
      }

    }));

    this.subscriptions.push(this._whatsAppService.ContactList.auditTime(1000).subscribe(contactsList => {
      if (this._whatsAppService.Initialized.getValue()) {

        this.contactList = contactsList.sort((a, b) => {

          return ((Date.parse(new Date(a.lastTouchedTime).toISOString()) - Date.parse(new Date(b.lastTouchedTime).toISOString())) > 0) ? -1 : 1

        });
        // console.log('ContacList Sorted : ', this._whatsAppService.Initialized.getValue());
        this.initialized = true;
      }

    }));

    // this.subscriptions.push(this._whatsAppService.Initialized.subscribe(data => {
    //   console.log('Initiazlied : ', data);
    //   this.initialized = data;
    // }))
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscriptions.map(subscription => { subscription.unsubscribe(); })
  }

  SearchContact(event: Event) {
    // console.log(event)
    this._whatsAppService.SearchValue.next(event);
    this.tempSearchValue = event.toString();
    if (event.toString()) this._whatsAppService.__Searching.next(true);
    else this._whatsAppService.__Searching.next(false);
  }

  Focused(event?: Event) {
    if (this.selectedContact && this.selectedContact.unreadCount) {
      this._whatsAppService.UnsetReadCount(this.selectedContact._id);
    }
  }

  SetSelectedContact(event) {
    if (this.searchList && this.tempSearchValue) this._whatsAppService.SetSelectedContact(event.contactID, true)
    else this._whatsAppService.SetSelectedContact(event.contactID)


  }

  GetMoreContacts(event) {
    if (!this.fetching && event.lastTouchedTime) {
      this.fetching = true;
      this._whatsAppService.FetchMoreContacts(event.lastTouchedTime).subscribe(res => {
        this.fetching = false;
      }, err => {
        this.fetching = false;
      })
    }
  }

  GetMoreMessages(event) {
    // console.log('Getting MOre Messages : ', event);
    if (this.fetchingMessages || this.selectedContact.synced) return;
    this.fetchingMessages = true;
    this._whatsAppService.GetMoreMessages(event.lastMessageID, this.selectedContact.customerNo, this.selectedContact._id).subscribe(res => {
      setTimeout(() => {
        this.fetchingMessages = false;
      }, 500);
    }, err => {
      this.fetchingMessages = false;
    });
  }

  keyup(event: KeyboardEvent) {

    switch (event.key.toLowerCase()) {
      case 'enter':
        {
          if (this.shiftdown) {
            event.preventDefault();
          } else {
            this.SendMessage(this.msgBody);
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

  updatedContact = undefined;
  EditContact(event: any) {
    // console.log(event);
    this._whatsAppService.EditContact(event).subscribe(res => {
      this.updatedContact = event

    }, err => {
      event.failed = true;
      this.updatedContact = event
    })
  }

  SendMessage(textMessage: string) {

    if (this.files && this.files.length && !this.uploading) {
      this.uploadingCount = this.files.length
      this.files.map((file) => {
        this.SendAttachmentWithProgress(file);
      });
      this.fileInput.nativeElement.value = '';

    }

    if (textMessage) {

      let msg = {
        userId: this.customEmail,
        conversationid: "",
        customerNo: this.selectedContact.customerNo,
        keyremotejid: "",
        textMessage: textMessage,
        timestamp: Date.parse(new Date().toISOString()),
        mediaURL: 0,
        mediamimetype: 0,
        mediawatype: 0,
        mediasize: 0,
        medianame: "",
        mediahash: 0,
        mediaduration: 0,
        latitude: "",
        sendcount: 1,
        longitude: "",
        receivedtimestamp: "",
        sendtimestamp: -1,
        receiptservertimestamp: "",
        receiptdevicetimestamp: -1,
        quotedrowid: 0,
        editversion: "",
        mediaenchash: 0,
        forwarded: 0,
        key_from_me: '1',
        agentName: this._whatsAppService.Agent.nickname,
        status: 'sending',
        sentTime: Date.parse(new Date().toISOString()),
        contactID: this.selectedContact._id
      }
      this._whatsAppService.SendMessage(JSON.parse(JSON.stringify(msg)), this.selectedContact._id).subscribe(res => {

      }, err => {
        //Do Something
      });
      this.msgBody = '';
      (msg as any).autoScroll = true;
      if (this.selectedContact.tempMessages && this.selectedContact.tempMessages.length) this.selectedContact.tempMessages = [...this.selectedContact.tempMessages, ...[msg]]
      else this.selectedContact.tempMessages = [msg];
    }

  }

  ReSendMessage(msg: any) {
    if (msg.textMessage) {

      this._whatsAppService.ReSendMessage(msg, this.selectedContact._id).subscribe(res => {

      }, err => {
        //Do Something
      });
    }
  }


  readURL(files): Observable<any> {
    return new Observable((observer) => {
      this.attachmentGallery = [];

      this._uploadingService.readURL(files).subscribe(data => {
        ////console.log('readURL')
        if (data) {
          this.attachmentGallery = data;
          observer.next({ status: 'ok' });
          observer.complete();
        }

      })
    });
  }
  FileSelected(event: Event) {
    this.ShowAttachmentAreaDnd = false;
    // this.fileValid = true;
    for (let i = 0; i < this.fileInput.nativeElement.files.length; i++) {
      if (this.fileInput.nativeElement.files.length > 0) {
        this.files.push(this.fileInput.nativeElement.files[i]);
        // this.files = this.files.concat(this.fileInput.nativeElement.files[i]);
      }
    }

    this.readURL(this.files).subscribe(response => {
      if (response.status == 'ok') {
        this.ShowAttachmentAreaDnd = true;
        //	if (!this.uploading) this._chatService.setDraftFiles(this.currentConversation._id, this.files, this.currentConversation.arrToDialog);
      }
    });

  }

  ReloadMessages() {
    this.fetchingMessages = true;
    this._whatsAppService.GetOldMessages(this.selectedContact.customerNo, this.selectedContact._id).subscribe(res => {
      setTimeout(() => {
        this.fetchingMessages = false;
      }, 500);
    }, err => {
      this.fetchingMessages = false;
    });
  }


  onClear(event) {


    if (event.clearAll) {
      if (this.fileInput) this.fileInput.nativeElement.value = '';
      this.ShowAttachmentAreaDnd = false;
      this.uploading = false;
      this.fileValid = false;
      this.files = [];
    } else if (event.fileToRemove) {
      let index = this.files.findIndex(w => w.name == event.fileToRemove.name);
      if (index != -1) {
        this.files.splice(index, 1);
      }
    }
  }
  

  __CancelUpload(sentTime: Event) {
    //cancel from service
    /**
     * sentTime : number
     */
    // console.log('Cancel WhatsApp Componene');
    this._whatsAppService.CancelUpload(sentTime);

  }

  __ResendAttachment(event: any) {
    // console.log('__Resend :', event)
    switch (event.errorType) {
      case 'server-error':
        event.msg.errored = false;
        event.msg.errorType = '';
        this._whatsAppService.SendAttachment(event.msg, this.selectedContact._id, this.selectedContact).subscribe(res => {

        }, err => {

        });
        break;
      default:
        event.msg.errored = false;
        event.msg.uploading = true;
        event.msg.errorType = '';
        event.msg.progress = 0;
        this._whatsAppService.UploadAttachmnt(event.msg, this.selectedContact._id, this.selectedContact);
        break;
      // case 'xml-parse-error':
      // case 'wrong-response-error':
      // case 'upload-error':
      //   break;
    }
  }


  SendAttachmentWithProgress(file) {
    // console.log('Sending Attachment : ', file);
    let galleryIndex = this.attachmentGallery.findIndex(w => w.name == file.name);
    if (galleryIndex != -1) {
      if (this.attachmentGallery[galleryIndex] && this.attachmentGallery[galleryIndex].uploading) return;
      else this.attachmentGallery[galleryIndex].uploading = true;
    }
    this._uploadingService.GenerateLinksForFilesNew(file, 'SendAttachMent').subscribe(response => {
      // console.log('Attachment Response :', response.params.file.name);
      if (response) {

        this.uploadingCount = this.uploadingCount - 1
        if (this.uploadingCount == 0) {

          this.uploading = false
        }
        if (!response.error) {

          let msg = {
            userId: this.customEmail,
            conversationid: "",
            customerNo: this.selectedContact.customerNo,
            keyremotejid: "",
            textMessage: "",
            timestamp: Date.parse(new Date().toISOString()),
            mediaURL: response.path,
            mediamimetype: this._utilityService.GetMediaType(response.params.file.name),
            mediawatype: 0,
            mediasize: 0,
            medianame: "",
            mediahash: 0,
            mediaduration: 0,
            latitude: "",
            sendcount: 1,
            longitude: "",
            receivedtimestamp: "",
            sendtimestamp: -1,
            receiptservertimestamp: "",
            receiptdevicetimestamp: -1,
            quotedrowid: 0,
            editversion: "",
            mediaenchash: 0,
            forwarded: 0,
            key_from_me: '1',
            agentName: this._whatsAppService.Agent.nickname,
            attachment: true,
            filename: response.params.file.name,
            errored: false,
            errorType: '',
            uploading: false,
            progress: 0,
            sentTime: Date.parse(new Date().toISOString()),
            params: response.params,
          };

          // console.log((this.selectedContact.tempMessages && this.selectedContact.tempMessages.length));
          (msg as any).autoScroll = true;
          if (this.selectedContact.tempMessages && this.selectedContact.tempMessages.length) this.selectedContact.tempMessages = [...this.selectedContact.tempMessages, ...[msg]]
          else this.selectedContact.tempMessages = [msg];
          this._whatsAppService.UploadAttachmnt(msg, this.selectedContact._id, this.selectedContact);
          // console.log(this.selectedContact.tempMessages);

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

  GetAttachments(event: any) {
    // console.log('Getting Attachments sEmit', event);
    this._whatsAppService.GetAttchments(event);
  }

  /**
   * @Voice_Note_Work
   */

  StartRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
      this.mediaStream = stream;
      this.recordRTC = RecordRTC(stream, {
        type: 'audio'
      });

      this.recordRTC.startRecording();
      this.audioStarted = true;
      this.recordingInterval = setInterval(() => {
        this.seconds++;
        if (this.seconds == 60) {
          this.mins += 1;
          this.SendRecording();
          clearInterval(this.recordingInterval);
        }
      }, 1000);
    }).catch((err) => { });
  }

  CancelRecording() {
    this.seconds = 0;
    this.mins = 0;
    this.recordRTC.stopRecording(() => {
      this.audioStarted = false;
      this.mediaStream.getTracks()[0].stop();
      clearInterval(this.recordingInterval);
    });
  }

  SendRecording() {

    this.seconds = 0;
    this.mins = 0;
    this.recordRTC.stopRecording(() => {

      clearInterval(this.recordingInterval);

      this.audioStarted = false;
      this._uploadingService.getSeekableBlob(this.recordRTC.getBlob(), (blob) => {
        // console.log('Blob : ', blob);
        let file = new File([blob], ('stream' + Date.parse(new Date().toISOString()) + '.webm'), { type: 'audio/webm' });
        // console.log('file : ', file);
        // console.log('Stingified file : ', JSON.parse(JSON.stringify(file)));

        // console.log(URL.createObjectURL(blob));
        this.SendAttachmentWithProgress(new File([file], file.name));
        this.mediaStream.getTracks()[0].stop();
      });
    });

  }

  //#region Old Stop Recording
  // stopRecording() {
  //   if (!this.isAudioSent && !this.recordedFile) {
  //     this.seconds = 0;
  //     this.mins = 0;
  //     this.recordingStarted = false;
  //     this.loadingAudio = true;
  //     this.recordRTC.stopRecording(() => {
  //       // let recording = this.recordRTC.getBlob();
  //       this._uploadingService.getSeekableBlob(this.recordRTC.getBlob(), (blob) => {
  //         let file = new File([blob], ('stream' + new Date().getTime() + '.mp3'), { type: 'audio/webm' });
  //         if (file && !this.uploading) {
  //           this.uploading = true;
  //           this._uploadingService.SignRequest(file, 'SendAttachMent').subscribe(response => {
  //             let params = JSON.parse(response.text());
  //             params.file = file;
  //             this._uploadingService.uploadAttachment(params).subscribe(s3response => {
  //               if (s3response.status == '201') {

  //                 this._uploadingService.parseXML(s3response.text()).subscribe(json => {

  //                   this._chatService.SendAttachment(this.currentConversation.sessionid, {
  //                     from: this.agent.nickname,
  //                     to: this.currentConversation.sessionid,
  //                     body: [{ filename: file.name, path: json.response.PostResponse.Location[0] }],
  //                     cid: this.currentConversation._id,
  //                     attachment: true,
  //                     filename: file.name
  //                   }, file.name).subscribe(res => { }, err => { });
  //                   this.file = '';
  //                   this.fileInput.nativeElement.value = '';
  //                   this.uploading = false;
  //                   this.loadingAudio = false;
  //                 }, err => {
  //                   this.uploading = false;
  //                   this.loadingAudio = false;
  //                 });
  //               }
  //             }, err => {
  //               this.uploading = false;
  //               this.loadingAudio = false;
  //             });
  //           }, err => {
  //             this.uploading = false;
  //             this.loadingAudio = false;
  //             this.fileValid = false;
  //             setTimeout(() => [
  //               this.fileValid = true
  //             ], 3000);
  //           });
  //         }
  //         // saveAs(file, 'stream'+ new Date().getTime() + '.mp3');
  //         this.mediaStream.getTracks()[0].stop();
  //         this.isAudioSent = true;
  //         clearInterval(this.recordingInterval);
  //       });
  //     });
  //   } else if (this.recordedFile) {
  //     this.uploading = true;
  //     this._uploadingService.SignRequest(this.recordedFile, 'SendAttachMent').subscribe(response => {
  //       let params = JSON.parse(response.text());
  //       params.file = this.recordedFile;
  //       this._uploadingService.uploadAttachment(params).subscribe(s3response => {
  //         if (s3response.status == '201') {
  //           this._uploadingService.parseXML(s3response.text()).subscribe(json => {
  //             this._chatService.SendAttachment(this.currentConversation.sessionid, {
  //               from: this.agent.nickname,
  //               to: this.currentConversation.sessionid,
  //               body: [{ filename: this.recordedFile.name, path: json.response.PostResponse.Location[0] }],
  //               cid: this.currentConversation._id,
  //               attachment: true,
  //               filename: this.recordedFile.name
  //             }, this.recordedFile.name).subscribe(res => { }, err => { });
  //             this.recordedFile = undefined;
  //             this.fileInput.nativeElement.value = '';
  //             this.uploading = false;
  //             this.loadingAudio = false;
  //             this.mediaStream.getTracks()[0].stop();
  //             this.isAudioSent = true;
  //             clearInterval(this.recordingInterval);
  //           }, err => {
  //             this.uploading = false;
  //             this.loadingAudio = false;
  //           });
  //         }
  //       }, err => {
  //         this.uploading = false;
  //         this.loadingAudio = false;
  //       });
  //     }, err => {
  //       this.uploading = false;
  //       this.loadingAudio = false;
  //       this.fileValid = false;
  //       setTimeout(() => [
  //         this.fileValid = true
  //       ], 3000);
  //     });
  //   }
  // }
  //#endregion

}
