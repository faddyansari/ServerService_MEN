import { Injectable, ɵConsole } from "@angular/core";

//RxJs Imports
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Http } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { SocketService } from "../services/SocketService";
import { AuthService } from "./AuthenticationService";
import { GlobalStateService } from "./GlobalStateService";
import { PushNotificationsService } from "./NotificationService";
import 'rxjs/add/operator/distinctUntilChanged';
import { UploadingService } from "./UtilityServices/UploadingService";
import { HttpEvent, HttpEventType, HttpResponse } from "@angular/common/http";



@Injectable()
export class WhatsAppService {
    public Agent;
    private showNotification = false;
    public canAccessWhatsApp: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public authChecked: BehaviorSubject<boolean> = new BehaviorSubject(false);

    private subscriptions: Subscription[] = [];
    public notification: Subject<any> = new Subject();
    private ServiceURL = '';

    public ContactList: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    public SearchList: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    public SelectedContact: BehaviorSubject<any> = new BehaviorSubject(undefined);
    public synced: BehaviorSubject<boolean> = new BehaviorSubject(false); ''
    public customEmail: BehaviorSubject<string> = new BehaviorSubject('');

    public FetchingContacts: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public Initialized: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public socket: SocketIOClient.Socket;




    public urlRegex: RegExp = /((http(s)?:\/\/)?([\w-]+\.)+[\w-]+[.com]+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?)/gmi;


    //ChatHistoryList
    permissions: any;
    conversationsFetched = false;
    archivesFetched = false;
    //Change to Behaviour Subject if Any Error Occured
    //private Agent : BehaviorSubject<any> = new BehaviorSubject({});

    ContactUpdates: BehaviorSubject<any> = new BehaviorSubject({});
    ContactOldMessagesReadCount: BehaviorSubject<any> = new BehaviorSubject({});
    MessageUpdates: BehaviorSubject<any> = new BehaviorSubject({});
    MessageStatusUpdates: BehaviorSubject<any> = new BehaviorSubject({});
    Attachmentupdates: BehaviorSubject<any> = new BehaviorSubject({});
    __Searching: BehaviorSubject<boolean> = new BehaviorSubject(false);

    MessageUnreadCount: BehaviorSubject<number> = new BehaviorSubject(0);
    SearchValue: Subject<any> = new Subject();
    fetchingRequest = {};
    settingUnreadCount = {};
    currentUploads = {};
    attachmentsRequest = {};

    constructor(
        private _socket: SocketService, private http: Http,
        private _authService: AuthService,
        private _appStateService: GlobalStateService,
        private _uploadingService: UploadingService,
        private _notificationService: PushNotificationsService) {
        //////console.log('Chat Service Initialized');

        _authService.getSettings().subscribe(data => {
            if (data && data.permissions) { }
        });

        _authService.WhatsAppAserviceURL.subscribe(url => {
            this.ServiceURL = url + '/wapp';
        })

        this.subscriptions.push(this.SearchValue.debounceTime(1000).distinctUntilChanged().subscribe(value => {
            if (!value) this.SearchList.next([]);
            else this.FetchWithSearch(value);
        }))

        this.subscriptions.push(_authService.getAgent().subscribe(agent => {
            this.Agent = agent;

            if (this.Agent) this.CheckAuth(this.Agent.email);

        }));
        this.subscriptions.push(this.ContactUpdates.auditTime(1000).subscribe(data => {
            Object.keys(data).map(key => {
                // console.log(this.ContactList.getValue().length);
                let temp = this.ContactList.getValue().filter(oldContact => {
                    if (oldContact._id == this.ContactUpdates.getValue()[key]._id) {
                        if (oldContact.messages) this.ContactUpdates.getValue()[key].messages = oldContact.messages;
                        if (oldContact.tempMessages) this.ContactUpdates.getValue()[key].tempMessages = oldContact.tempMessages;
                        this.ContactUpdates.getValue()[key].synced = oldContact.synced;
                        if (this.SelectedContact.getValue() && this.SelectedContact.getValue()._id == oldContact._id) this.SelectedContact.next(this.ContactUpdates.getValue()[key]);
                        return false;
                    } else {
                        return true;
                    }
                });
                this.ContactList.next([...[this.ContactUpdates.getValue()[key]], ...temp]);
                delete this.ContactUpdates.getValue()[key];
            });
            this.ContactUpdates.next(this.ContactUpdates.getValue());
        }))


        /**
        * @Cases
        * 1. Agar Contact nhi hai tou Fetch karna hai
        * 2. Agar hai tou  List main top par laana hai (Done)
        * 3. Agar Selected Contact hai tou messages bhi update karne hain. (Done)
        */

        this.subscriptions.push(this.MessageUpdates.debounceTime(3000).subscribe(data => {
            // console.log('processing Updates Message : ', JSON.parse(JSON.stringify(data)));
            Object.keys(data).map(key => {

                let found = false;
                let oldConact = undefined;
                let newContactList = this.ContactList.getValue().filter(contact => {
                    if (contact.customerNo == key) {
                        found = true;
                        oldConact = JSON.parse(JSON.stringify(contact));
                        return false;
                    } else return true;
                });

                if (found) {
                    // console.log('Found ', oldConact.messages);
                    oldConact.lastTouchedTime = new Date().toISOString();
                    (!isNaN(oldConact.unreadCount) && oldConact.unreadCount) ? oldConact.unreadCount += this.MessageUpdates.getValue()[key].messages.length : oldConact.unreadCount = this.MessageUpdates.getValue()[key].messages.length
                    if (!oldConact.messages) oldConact.messages = this.MessageUpdates.getValue()[key].messages;
                    else oldConact.messages = [...oldConact.messages, ...this.MessageUpdates.getValue()[key].messages];
                    if (this.SelectedContact.getValue() && this.SelectedContact.getValue()._id == oldConact._id) this.SelectedContact.next(oldConact);
                    newContactList = [...[oldConact], ...newContactList];
                    this.ContactList.next(newContactList);
                    // console.log('New Messages : ', this.SelectedContact.getValue().messages)
                    delete this.MessageUpdates.getValue()[key];

                } else {

                    if (!this.fetchingRequest[key]) {
                        this.FetchContactByPhoneNumber(key, this.customEmail.getValue());
                    }
                    delete this.MessageUpdates.getValue()[key];
                }

            });
            // this.MessageUpdates.next(this.MessageUpdates.getValue());
        }))

        this.subscriptions.push(this.MessageStatusUpdates.debounceTime(2000).subscribe(data => {
            // console.log('Message AQueue : ', JSON.parse(JSON.stringify(data)));
            Object.keys(data).map(customerNo => {
                this.ContactList.getValue().map(contact => {
                    if (customerNo == contact.customerNo && contact.messages) {
                        // console.log('Custmer FOund :', customerNo);
                        contact.messages = contact.messages.map(msg => {
                            // console.log('msg found : ', msg._id == this.MessageStatusUpdates.getValue()[customerNo][msg._id]);
                            if (data[customerNo][msg._id]) {
                                msg.status = 'delivered';
                            }
                            return msg;
                        })
                        // console.group('Messages : ', contact.messages);
                    }
                });
                delete this.MessageStatusUpdates.getValue()[customerNo];
            });
            this.ContactList.next(this.ContactList.getValue());
        }))

        this.subscriptions.push(this.ContactOldMessagesReadCount.debounceTime(500).subscribe(data => {
            // console.log('Message AQueue : ', JSON.parse(JSON.stringify(data)));
            Object.keys(data).map(customerNo => {
                this.ContactList.getValue().map(contact => {
                    if (customerNo == contact.customerNo && contact.messages) {
                        if (!contact.OldMessagesCount) contact.OldMessagesCount = this.ContactOldMessagesReadCount.getValue()[customerNo].OldMessagesCount;
                        else contact.OldMessagesCount += this.ContactOldMessagesReadCount.getValue()[customerNo].OldMessagesCount;
                        contact.synced = false;
                        if (this.ContactOldMessagesReadCount.getValue()[customerNo].ended) contact.ended = true;
                    }
                });
                delete this.ContactOldMessagesReadCount.getValue()[customerNo];
            });
            this.ContactList.next(this.ContactList.getValue());
        }))

        this.subscriptions.push(this.Attachmentupdates.debounceTime(2000).subscribe(data => {
            // console.log('Message AQueue : ', JSON.parse(JSON.stringify(data)));
            Object.keys(data).map(customerNo => {
                this.ContactList.getValue().map(contact => {
                    // console.log('Attachment Upate : ', contact.attachments);
                    if (customerNo == contact.customerNo && contact.attachments) {

                        this.Attachmentupdates.getValue()[customerNo].attachments.map(attachment => {
                            switch (attachment.mediamimetype) {
                                case '1':
                                case '2':
                                case '3':
                                    if (!contact.attachments.media) contact.attachments.media = [];
                                    (contact.attachments.media as Array<any>).unshift({
                                        mimeType: attachment.mediamimetype,
                                        customEmail: attachment.userId,
                                        customerNo: attachment.customerNo,
                                        mediaURL: attachment.mediaURL,
                                        messageID: '',
                                        filename: attachment.filename,
                                        contactID: contact._id
                                    });
                                    break;
                                default:
                                    if (!contact.attachments.files) contact.attachments.files = [];
                                    (contact.attachments.files as Array<any>).unshift({
                                        mimeType: attachment.mediamimetype,
                                        customEmail: attachment.userId,
                                        customerNo: attachment.customerNo,
                                        mediaURL: attachment.mediaURL,
                                        messageID: '',
                                        filename: attachment.filename,
                                        contactID: contact._id
                                    });
                                    break;
                            }
                        })
                        // console.log('Attachments : ', contact.attachments)
                        if (contact.attachments.media) contact.attachments.media = (contact.attachments.media as Array<any>).slice(0, 10);
                        if (contact.attachments.files) contact.attachments.files = (contact.attachments.files as Array<any>).slice(0, 10);
                    }

                });
                delete this.ContactOldMessagesReadCount.getValue()[customerNo];
            });
            this.ContactList.next(this.ContactList.getValue());
        }))





        _socket.getSocket().subscribe((data) => {
            if (data) {
                this.socket = data;
                this.socket.on('wappNewContacts', (data) => {
                    // console.log('wappNewContacts', data._id);
                    let eventkey = data.customerNo + Date.parse(new Date().toString()).toString();
                    this.ContactUpdates.getValue()[eventkey] = data;
                    this.ContactUpdates.next(this.ContactUpdates.getValue());
                });


                this.socket.on('wappNewMessages', (data) => {
                    let eventkey = data.customerNo;
                    if (this.MessageUpdates.getValue()[eventkey] && this.MessageUpdates.getValue()[eventkey].messages) {
                        this.MessageUpdates.getValue()[eventkey].messages.push(data);
                        this.MessageUpdates.next(this.MessageUpdates.getValue());
                    } else {
                        this.MessageUpdates.getValue()[eventkey] = {};
                        this.MessageUpdates.getValue()[eventkey].messages = [];
                        this.MessageUpdates.getValue()[eventkey].messages.push(data);
                        this.MessageUpdates.next(this.MessageUpdates.getValue());
                    }
                    // console.log('wappNewMessages', this.MessageUpdates.getValue());
                    this.MessageUnreadCount.next(this.MessageUnreadCount.getValue() + 1);

                    if (data && data.attachment) {
                        console.log('NExting Attachments : ', data)
                        if (this.Attachmentupdates.getValue()[eventkey] && this.Attachmentupdates.getValue()[eventkey].attachments) {
                            this.Attachmentupdates.getValue()[eventkey].attachments.push(data);
                            this.Attachmentupdates.next(this.Attachmentupdates.getValue());
                        } else {
                            this.Attachmentupdates.getValue()[eventkey] = {};
                            this.Attachmentupdates.getValue()[eventkey].attachments = [];
                            this.Attachmentupdates.getValue()[eventkey].attachments.push(data);
                            this.Attachmentupdates.next(this.Attachmentupdates.getValue());
                        }

                    }


                });

                /**
                 * @data
                 * 1.custumerNo
                 * 2.messageID
                 * 3.status
                 */


                this.socket.on('wappUpdateMsgStatus', (data) => {
                    // console.log(data);
                    let eventkey = data.customerNo;
                    if (this.MessageStatusUpdates.getValue()[eventkey]) {
                        this.MessageStatusUpdates.getValue()[eventkey][data.messageID] = data.status;
                    } else {
                        this.MessageStatusUpdates.getValue()[eventkey] = {};
                        this.MessageStatusUpdates.getValue()[eventkey][data.messageID] = data.status;
                    }

                    this.MessageStatusUpdates.next(this.MessageStatusUpdates.getValue());

                });

                /**
                 * @data
                 * 1.messagesRecieved
                 * 2.ended
                 * 3.customerNo
                 */


                this.socket.on('wappOldMessaages', (data) => {
                    console.log('wappOldMessaages :', data);
                    let eventkey = data.customerNo;
                    if (this.ContactOldMessagesReadCount.getValue()[eventkey]) {
                        this.ContactOldMessagesReadCount.getValue()[eventkey].OldMessagesCount += data.OldMessagesCount;
                        this.ContactOldMessagesReadCount.getValue()[eventkey].ended += data.ended;
                    } else {
                        this.ContactOldMessagesReadCount.getValue()[eventkey] = {};
                        this.ContactOldMessagesReadCount.getValue()[eventkey] = data;
                    }

                    this.ContactOldMessagesReadCount.next(this.ContactOldMessagesReadCount.getValue());

                });
            }

        });

    }

    public Noaccess() {
        this._appStateService.canAccessPageNotFound.next(true);
        this._appStateService.NavigateTo('/noaccess');
    }

    public AddContact(contact): Observable<any> {
        contact.email = this.customEmail.getValue();
        return new Observable((observer) => {

            this.http.post(this.ServiceURL + '/add_contact', { contact: contact }, { withCredentials: true }).subscribe(res => {
                if (res.status == 200) {
                    this.ContactList.next([...[res.json().contact], ...this.ContactList.getValue()]);
                    observer.next(res.json().status);
                    observer.complete();
                } else if (res.status == 203) {
                    observer.next(res.json().status);
                    observer.complete();
                } else {
                    observer.error(res.json().status);
                    observer.complete();
                }
            }, err => {
                observer.error(err);
                observer.complete();
            });
        })

    }

    public EditContact(contact): Observable<any> {
        return new Observable((observer) => {

            this.http.post(this.ServiceURL + '/edit_contact', { contact: contact }, { withCredentials: true }).subscribe(res => {
                if (res.status == 200) {
                    this.ContactList.next(this.ContactList.getValue().map(oldContact => {
                        if (oldContact._id == contact._id) {
                            // console.log('Updating Contact : ', contact);
                            oldContact = JSON.parse(JSON.stringify(contact));
                        }
                        return oldContact;
                    }));
                    observer.next(res.json().status);
                    observer.complete();
                } else {
                    observer.error(res.json().status);
                    observer.complete();
                }
            }, err => {
                observer.error(err);
                observer.complete();
            });
        })
    }


    private FetchContactByPhoneNumber(customerNo: string, email: string) {
        this.fetchingRequest[customerNo] = true;
        this.http.post(this.ServiceURL + '/get_contact_single', { email: email, customerNo: customerNo }, { withCredentials: true }).subscribe(res => {
            if (res.status == 200) {
                if (res.json().contact.length) this.ContactList.next([...res.json().contact, ...this.ContactList.getValue()]);
            }
            delete this.fetchingRequest[customerNo];
        }, err => {
            delete this.fetchingRequest[customerNo];
        });

    }

    private FetchWithSearch(value) {

        // console.log('Searching');
        this.http.post(this.ServiceURL + '/search_contacts', { value: value, email: this.customEmail.getValue() }, { withCredentials: true }).subscribe(res => {
            if (res.status == 200) {
                this.SearchList.next(res.json().contacts);
            }
            this.__Searching.next(false);
        }, err => {
            // Do Something
            this.SearchList.next([]);
            this.__Searching.next(false);
        });

    }

    private FetchContacts() {
        this.FetchingContacts.next(true);
        this.http.post(this.ServiceURL + '/get_contacts', { email: this.customEmail.getValue() }, { withCredentials: true }).subscribe(res => {
            this.FetchingContacts.next(false);
            if (res.status == 200) {
                this.ContactList.next(res.json().contacts);
                if (res.json().contacts.length < 20) {
                    this.synced.next(true);
                }
            }
            if (!this.Initialized.getValue()) this.Initialized.next(true);
        }, err => {

            this.ContactList.next([]);
            if (!this.Initialized.getValue()) this.Initialized.next(true);

        });

    }



    public FetchMoreContacts(lastTouchedTime): Observable<any> {
        return new Observable((observer) => {

            if (!this.synced.getValue()) {

                this.http.post(this.ServiceURL + '/get_more_contacts', { email: this.customEmail.getValue(), lastTouchedTime: lastTouchedTime }, { withCredentials: true }).subscribe(res => {
                    observer.next({ satus: 'ok' });
                    observer.complete();
                    if (res.status == 200) {
                        this.ContactList.next([...this.ContactList.getValue(), ...res.json().contacts]);
                        if (res.json().contacts.length < 20) {
                            this.synced.next(true);
                        }
                    }
                }, err => {
                    observer.error(err);
                    observer.complete();
                });
            } else {
                observer.next({ satus: 'ok' });
                observer.complete();
            }
        })

    }

    private CheckAuth(email) {

        this.http.post(this.ServiceURL + '/validate', { email: email }, { withCredentials: true }).subscribe(res => {
            if (res.status == 200) {
                this.customEmail.next(res.json().email);
                this.FetchContacts();
                this.authChecked.next(true);
                this._appStateService.canAccessWhatsApp.next(true);
                this.canAccessWhatsApp.next(true);
                this.GetCount();
            } else {
                this.authChecked.next(true);
                this._appStateService.canAccessWhatsApp.next(false);
                this.canAccessWhatsApp.next(false);
            }
        }, err => {

            this.authChecked.next(true);
            this._appStateService.canAccessWhatsApp.next(false);
            this.canAccessWhatsApp.next(false);
        });

    }

    public ReSendMessage(msg, contactID): Observable<any> {
        return new Observable(observer => {
            let sentTime = msg.sentTime;
            this.http.post(this.ServiceURL + '/resend_message', { message: msg }, { withCredentials: true }).subscribe(res => {
                if (res.status == 200) {
                    this.ContactList.next(this.ContactList.getValue().map(contact => {
                        if (contact._id == contactID) {
                            msg.status = 'sent'
                            msg.sentTime = sentTime;
                            msg._id = res.json().id;
                            contact.lastTouchedTime = new Date().toISOString();
                            contact.messages = [...contact.messages, ...[msg]];
                            contact.tempMessages = contact.tempMessages.filter(tempMsg => { return tempMsg.sentTime != sentTime });
                            // console.log('msgID', msg._id);
                            // console.log(contact.tempMessages);
                            // console.log(contact.messages);
                            if (this.SelectedContact.getValue()._id == contactID) this.SelectedContact.next(contact);
                        }
                        return contact;
                    }));
                    // console.log(this.SelectedContact.getValue());
                    // console.log(res.json());
                    observer.next({ status: 'ok' });
                    observer.complete();

                }
            }, err => {

                this.ContactList.next(this.ContactList.getValue().map(contact => {
                    if (contact._id == contactID) {
                        msg.status = 'failed'
                        if (this.SelectedContact.getValue()._id == contactID) this.SelectedContact.next(contact);
                    }
                    return contact;
                }));

                observer.error({ status: 'error', error: err });
                observer.complete();
            });
        })


    }

    public SendMessage(msg, contactID): Observable<any> {
        return new Observable(observer => {
            let sentTime = msg.sentTime;
            let currentContact = JSON.parse(JSON.stringify(this.SelectedContact.getValue()));
            let found = false;
            this.http.post(this.ServiceURL + '/send_message', { message: msg }, { withCredentials: true }).subscribe(res => {
                if (res.status == 200) {
                    let result = this.ContactList.getValue().map(contact => {
                        if (contact._id == contactID) {
                            found = true;
                            msg.autoScroll = true;
                            msg.status = 'sent'
                            msg.sentTime = sentTime;
                            msg._id = res.json().id;
                            contact.lastTouchedTime = new Date().toISOString();
                            contact.messages = [...contact.messages, ...[msg]];
                            contact.tempMessages = contact.tempMessages.filter(tempMsg => { return tempMsg.sentTime != sentTime });
                            // console.log('msgID', msg._id);
                            // console.log(contact.tempMessages);
                            // console.log(contact.messages);
                            if (this.SelectedContact.getValue()._id == contactID) this.SelectedContact.next(contact);
                        }
                        return contact;
                    })
                    if (found) {
                        this.ContactList.next(result);
                    }
                    if (!found) {
                        // console.log('not found');
                        msg.autoScroll = true;
                        msg.status = 'sent'
                        msg.sentTime = sentTime;
                        msg._id = res.json().id;
                        currentContact.lastTouchedTime = new Date().toISOString();
                        currentContact.messages = [...currentContact.messages, ...[msg]];
                        currentContact.tempMessages = currentContact.tempMessages.filter(tempMsg => { return tempMsg.sentTime != sentTime });
                        this.ContactList.getValue().unshift(currentContact);
                        this.ContactList.next(this.ContactList.getValue());

                        if (this.SelectedContact.getValue()._id == contactID) this.SelectedContact.next(currentContact);

                    }
                    observer.next({ status: 'ok' });
                    observer.complete();

                }
            }, err => {

                let result = this.ContactList.getValue().map(contact => {
                    if (contact._id == contactID) {
                        found = true;
                        contact.lastTouchedTime = new Date().toISOString();
                        contact.tempMessages = contact.tempMessages.map(tempMsg => { if (tempMsg.sentTime == sentTime) tempMsg.status = 'failed'; return tempMsg; });
                        // contact.messages = [...contact.messages, ...[msg]];
                        // contact.tempMessages = contact.tempMessages.filter(tempMsg => { return tempMsg.sentTime != sentTime });
                        // console.log(contact.messages);
                        if (this.SelectedContact.getValue()._id == contactID) this.SelectedContact.next(contact);
                    }
                    return contact;
                });
                if (found) this.ContactList.next(result);
                if (!found) {
                    currentContact.lastTouchedTime = new Date().toISOString();
                    currentContact.tempMessages = currentContact.tempMessages.map(tempMsg => { if (tempMsg.sentTime == sentTime) tempMsg.status = 'failed'; return tempMsg; });
                    // contact.messages = [...contact.messages, ...[msg]];
                    // contact.tempMessages = contact.tempMessages.filter(tempMsg => { return tempMsg.sentTime != sentTime });
                    // console.log(contact.messages);
                    this.ContactList.getValue().unshift(currentContact);
                    this.ContactList.next([[currentContact], ...this.ContactList.getValue()]);

                    if (this.SelectedContact.getValue()._id == contactID) this.SelectedContact.next(currentContact);
                }
                observer.error({ status: 'error', error: err });
                observer.complete();
            });
        })


    }





    public GetAttchments(event) {
        if (this.attachmentsRequest[event._id + event.type]) return;
        else {

            this.attachmentsRequest[event._id] = true;
            this.http.post(this.ServiceURL + '/get_attachments', { contactID: event._id, mimetype: event.type }, { withCredentials: true }).subscribe(res => {
                // console.log(res.json().msgs);
                if (res.status == 200) {
                    let foundInContactList = false;
                    this.ContactList.next(this.ContactList.getValue().map(contact => {
                        if (contact._id == event._id) {
                            foundInContactList = true;
                            if (!contact.attachments) contact.attachments = [];
                            switch (event.type) {
                                case '1':
                                case '2':
                                case '3':
                                    contact.attachments.media = res.json().attachments;
                                    break;
                                default:
                                    contact.attachments.files = res.json().attachments;
                                    break;
                            }

                            if (this.SelectedContact.getValue()._id == event._id) this.SelectedContact.next(contact);
                        }
                        return contact;
                    }));

                    this.SearchList.next(this.SearchList.getValue().map(contact => {
                        if (contact._id == event._id) {
                            if (!contact.attachments) contact.attachments = [];
                            switch (event.type) {
                                case '1':
                                case '2':
                                case '3':
                                    contact.attachments.media = res.json().attachments;
                                    break;
                                default:
                                    contact.attachments.files = res.json().attachments;
                                    break;
                            }

                            if (!foundInContactList) if (this.SelectedContact.getValue()._id == event._id) this.SelectedContact.next(contact);
                        }
                        return contact;
                    }));
                }
                delete this.attachmentsRequest[event._id + event.type]
            }, err => {
                //Do Something
                delete this.attachmentsRequest[event._id + event.type]
            });
        }
    }


    public CancelUpload(sentTime) {
        if (this.currentUploads[sentTime] && !(this.currentUploads[sentTime] as Subscription).closed) {
            (this.currentUploads[sentTime] as Subscription).unsubscribe();
        }
        if (this.SelectedContact.getValue()) {

            this.ContactList.next(this.ContactList.getValue().map(contact => {
                if (contact._id == this.SelectedContact.getValue()._id) {
                    contact.tempMessages = contact.tempMessages.filter(tempMsg => { return tempMsg.sentTime != sentTime });

                    this.SelectedContact.next(contact);
                }
                return contact;
            }));
        }
    }

    public UploadAttachmnt(msg, contactID, selectedContact) {

        /**
         * @Note
         * 1. keeping Current Contact copy to avoid Reference issue in selected Contact when contact was selected from search and uploaded the file
         */
        let currentContact = JSON.parse(JSON.stringify(selectedContact));
        // console.log('Current Contact Upload Attachm,ent', currentContact)

        this.currentUploads[msg.sentTime] = this._uploadingService.UploadAttachmentWithProgress(msg.params).subscribe((event: HttpEvent<any>) => {
            if (event.type == HttpEventType.UploadProgress) {
                // console.log("upload progress", Math.round((event.loaded / event.total) * 100));
                /**
                 * @Note
                 * Updating By Reference
                 */
                msg.progress = Math.round((event.loaded / event.total) * 100);
            }
            if (event.type == HttpEventType.Response) {
                if ((event.status == 201) && (event.statusText == 'Created')) {

                    this._uploadingService.parseXML(event.body.toString()).subscribe(json => {
                        msg.textMessage = json.response.PostResponse.Location[0];
                        msg.mediaURL = json.response.PostResponse.Location[0];
                        msg.progress = 100;
                        (this.currentUploads[msg.sentTime] as Subscription).unsubscribe();
                        delete this.currentUploads[msg.sentTime];
                        delete msg.params;
                        delete msg.autoScroll;
                        delete msg.hold;
                        this.SendAttachment(msg, contactID, currentContact).subscribe(res => {
                        }, err => {
                            msg.errored = true;
                            msg.uploading = false;
                            msg.errorType = 'server-error';
                            console.log('Server Error : ', err);
                        })
                    }, err => {
                        msg.errored = true;
                        msg.uploading = false;
                        msg.errorType = 'xml-parse-error';
                        console.log('XML Parse Error : ', err);

                    });
                } else {
                    msg.errored = true;
                    msg.uploading = false;
                    msg.errorType = 'wrong-response-error';
                    console.log('Wrong Response Error : ', event.body);
                }

            }
        }, err => {
            msg.errored = true;
            msg.uploading = false;
            msg.errorType = 'upload-error'
            console.log('Upload Error : ', err);
        });

        // let multi = this.currentUploads[msg.sentTime].subscribe(res => { console.log('2nd Upload'); })
    }

    public SendAttachment(msg, contactID, selectedContact): Observable<any> {
        // console.log('Sending attachment')
        return new Observable(observer => {
            msg.status = 'sending';
            /**
            * @Note
            * 1. keeping Current Contact copy to avoid Reference issue in selected Contact when contact was selected from search and uploaded the file
            */
            let currentContact = JSON.parse(JSON.stringify(selectedContact))
            let found = false;
            this.http.post(this.ServiceURL + '/send_message_attachment', { message: msg }, { withCredentials: true }).subscribe(res => {
                if (res.status == 200) {
                    let result = this.ContactList.getValue().map(contact => {
                        if (contact._id == contactID) {
                            found = true;
                            msg.autoScroll = false;
                            msg.errored = false;
                            msg.uploading = false;
                            msg._id = res.json().id
                            msg.status = 'sent';
                            contact.lastTouchedTime = new Date().toISOString();
                            contact.messages = [...contact.messages, ...[msg]];
                            contact.tempMessages = contact.tempMessages.filter(tempMsg => { return tempMsg.sentTime != msg.sentTime });

                            if (!contact.attachments) contact.attachments = [];
                            let obj = {
                                mimeType: msg.mediamimetype,
                                customEmail: msg.userId,
                                customerNo: msg.customerNo,
                                mediaURL: msg.mediaURL,
                                messageID: msg._id,
                                filename: msg.filename,
                                contactID: contactID,
                            }
                            switch (msg.mediamimetype) {
                                case '1':
                                case '2':
                                case '3':
                                    if (contact.attachments.media) contact.attachments.media.unshift(obj)
                                    contact.attachments.media = contact.attachments.media.splice(0, 10);
                                    break;
                                default:
                                    if (contact.attachments.files) contact.attachments.files.unshift(obj);
                                    break;
                            }

                            // console.log(contact.messages);
                            if (this.SelectedContact.getValue()._id == contactID) this.SelectedContact.next(contact);
                        }
                        return contact;
                    });

                    if (found) {
                        this.ContactList.next(result);
                    }

                    if (!found) {
                        msg.autoScroll = false;
                        msg.errored = false;
                        msg.uploading = false;
                        msg._id = res.json().id
                        msg.status = 'sent';
                        currentContact.lastTouchedTime = new Date().toISOString();
                        currentContact.messages = [...currentContact.messages, ...[msg]];
                        currentContact.tempMessages = currentContact.tempMessages.filter(tempMsg => { return tempMsg.sentTime != msg.sentTime });

                        if (!currentContact.attachments) currentContact.attachments = [];
                        let obj = {
                            mimeType: msg.mediamimetype,
                            customEmail: msg.userId,
                            customerNo: msg.customerNo,
                            mediaURL: msg.mediaURL,
                            messageID: msg._id,
                            filename: msg.filename,
                            contactID: contactID,
                        }
                        switch (msg.mediamimetype) {
                            case '1':
                                if (currentContact.attachments.media) currentContact.attachments.media.push(obj)

                                break;
                            default:
                                if (currentContact.attachments.files) currentContact.attachments.files.push(obj);
                                break;
                        }

                        // console.log(contact.messages);
                        this.ContactList.getValue().unshift(currentContact);
                        this.ContactList.next(this.ContactList.getValue());
                        if (this.SelectedContact.getValue()._id == contactID) this.SelectedContact.next(currentContact);
                    }
                    // console.log(this.SelectedContact.getValue());
                    // console.log(res.json());
                    observer.next({ status: 'ok' });
                    observer.complete();

                }
            }, err => {
                // console.log('error in sending Atatchment');
                msg.errored = true;
                msg.status = 'failed';
                msg.errorType = 'server-error';
                this.ContactList.getValue().map(contact => {
                    if (contact._id == currentContact._id) {
                        // console.log('found')
                        // console.log('Contact List : ', contact);
                        // console.log('Current Contact : ', currentContact);
                        found = true;
                    }

                    return contact;
                })
                if (!found) {
                    // console.log('Not Found ! : in sending Attachment');
                    // console.log('Before :',JSON.parse(JSON.stringify(this.ContactList.getValue())))
                    currentContact.lastTouchedTime = new Date().toISOString();
                    this.ContactList.next([...[currentContact], ...this.ContactList.getValue()]);
                    if (this.SelectedContact.getValue() && this.SelectedContact.getValue()._id == currentContact._id) this.SelectedContact.next(currentContact);
                    // console.log('After :',JSON.parse(JSON.stringify(this.ContactList.getValue())))

                }
                // console.log('Errored :', msg.errored);
                observer.error({ status: 'error', error: err });
                observer.complete();

            });
        })

    }

    public GetMoreMessages(lastMessageID, contactNnumber, contactID): Observable<any> {

        return new Observable(observer => {

            this.http.post(this.ServiceURL + '/get_more_messages', { customerNo: contactNnumber, email: this.customEmail.getValue(), id: lastMessageID }, { withCredentials: true }).subscribe(res => {
                // console.log(res.json().msgs);
                observer.next({ status: 'ok' });
                observer.complete();
                let foundInContactList = false;
                if (res.status == 200) {
                    this.ContactList.next(this.ContactList.getValue().map(contact => {
                        if (contact._id == contactID) {
                            foundInContactList = true;
                            if (res.json().msgs && res.json().msgs.length < 20) contact.synced = true;

                            contact.messages = [...res.json().msgs.reverse(), ...contact.messages];
                            if (this.SelectedContact.getValue()._id == contactID) this.SelectedContact.next(contact);
                        }
                        return contact;
                    }));

                    this.SearchList.next(this.SearchList.getValue().map(contact => {
                        if (contact._id == contactID) {

                            if (res.json().msgs && res.json().msgs.length < 20) contact.synced = true;

                            contact.messages = [...res.json().msgs.reverse(), ...contact.messages];
                            if (!foundInContactList) if (this.SelectedContact.getValue()._id == contactID) this.SelectedContact.next(contact);
                        }
                        return contact;
                    }));
                    // console.log(this.SelectedContact.getValue());
                    // console.log(res.json());

                }
            }, err => {
                //Do Something
                observer.error(err);
                observer.complete();
            });
        })
    }

    public GetOldMessages(contactNnumber, contactID, lastMessageID?): Observable<any> {

        return new Observable(observer => {

            this.http.post(this.ServiceURL + '/get_old_messages', { customerNo: contactNnumber, email: this.customEmail.getValue(), id: lastMessageID }, { withCredentials: true }).subscribe(res => {
                // console.log(res.json().msgs);
                observer.next({ status: 'ok' });
                observer.complete();
                if (res.status == 200) {
                    this.ContactList.next(this.ContactList.getValue().map(contact => {
                        if (contact._id == contactID) {

                            if (res.json().msgs && res.json().msgs.length < 20) contact.synced = true;

                            contact.messages = [...res.json().msgs.reverse(), ...contact.messages];
                            contact.OldMessagesCount = 0;
                            if (this.SelectedContact.getValue()._id == contactID) this.SelectedContact.next(contact);
                        }
                        return contact;
                    }));
                    // console.log(this.SelectedContact.getValue());
                    // console.log(res.json());

                }
            }, err => {
                //Do Something
                observer.error(err);
                observer.complete();
            });
        })
    }

    // ReloadMessages(customerNo, selectedContact) {

    //     let temp = JSON.parse(JSON.stringify(selectedContact));

    //     this.http.post(this.ServiceURL + '/get_messages', { customerNo: customerNo, email: this.customEmail.getValue() }, { withCredentials: true }).subscribe(res => {
    //         // console.log(res.json().msgs);
    //         if (res.status == 200) {
    //             this.ContactList.next(this.ContactList.getValue().map(contact => {
    //                 if (contact._id == temp._id) {

    //                     contact.fetchedOnce = true;
    //                     if (res.json().msgs && res.json().msgs.length < 20) contact.synced = true;

    //                     contact.messages = [...res.json().msgs.reverse()];
    //                     if (this.SelectedContact.getValue()._id == temp._id) this.SelectedContact.next(contact);
    //                 }
    //                 return contact;
    //             }));
    //             // console.log(this.SelectedContact.getValue());
    //             // console.log(res.json());

    //         }
    //     }, err => {
    //         //Do Something
    //     });
    // }

    public SetSelectedContact(contactID, searchList = false) {
        let temp = undefined;
        if (this.SelectedContact.getValue() && this.SelectedContact.getValue()._id == contactID) return;
        if (!searchList) {

            this.ContactList.getValue().map(contact => {
                if (contact._id == contactID) {
                    if (!contact.messages) contact.messages = [];
                    if (!contact.tempMessages) contact.tempMessages = [];
                    if (!contact.synced) contact.synced = false;
                    this.SelectedContact.next(contact);
                    temp = JSON.parse(JSON.stringify(contact));
                }
            })

            if (temp && this.SelectedContact.getValue() && temp._id == this.SelectedContact.getValue()._id && !this.SelectedContact.getValue().fetchedOnce && !this.SelectedContact.getValue().synced) {
                this.http.post(this.ServiceURL + '/get_messages', { customerNo: temp.customerNo, email: this.customEmail.getValue(), ended: this.SelectedContact.getValue().ended }, { withCredentials: true }).subscribe(res => {
                    // console.log(res.json().msgs);
                    if (res.status == 200) {
                        this.ContactList.next(this.ContactList.getValue().map(contact => {
                            if (contact._id == temp._id) {

                                contact.fetchedOnce = true;
                                if (res.json().msgs && res.json().msgs.length < 20) contact.synced = true;

                                contact.messages = [...res.json().msgs.reverse()];
                                if (this.SelectedContact.getValue()._id == temp._id) this.SelectedContact.next(contact);
                            }
                            return contact;
                        }));
                        // console.log(this.SelectedContact.getValue());
                        // console.log(res.json());

                    }
                }, err => {
                    //Do Something
                });
            }
        } else {
            // console.log('From Search List');
            let found = false;
            this.ContactList.getValue().map(contact => {
                if (contact._id == contactID) {
                    found = true;
                    if (!contact.messages) contact.messages = [];
                    if (!contact.tempMessages) contact.tempMessages = [];
                    if (!contact.synced) contact.synced = false;
                }
            })
            this.SearchList.getValue().map(contact => {
                if (contact._id == contactID) {
                    if (!contact.messages) contact.messages = [];
                    if (!contact.tempMessages) contact.tempMessages = [];
                    if (!contact.synced) contact.synced = false;
                    this.SelectedContact.next(contact);
                    temp = JSON.parse(JSON.stringify(contact));
                }
            })

            if (temp && this.SelectedContact.getValue() && temp._id == this.SelectedContact.getValue()._id && !this.SelectedContact.getValue().fetchedOnce && !this.SelectedContact.getValue().synced) {
                this.http.post(this.ServiceURL + '/get_messages', { customerNo: temp.customerNo, email: this.customEmail.getValue() }, { withCredentials: true }).subscribe(res => {
                    // console.log(res.json().msgs);
                    if (res.status == 200) {
                        this.SearchList.next(this.SearchList.getValue().map(contact => {
                            if (contact._id == temp._id) {

                                contact.fetchedOnce = true;
                                if (res.json().msgs && res.json().msgs.length < 20) contact.synced = true;

                                contact.messages = [...res.json().msgs.reverse()];
                                if (!found) if (this.SelectedContact.getValue()._id == temp._id) this.SelectedContact.next(contact);
                            }
                            return contact;
                        }));

                        if (found) {
                            this.ContactList.next(this.ContactList.getValue().map(contact => {
                                if (contact._id == temp._id) {

                                    contact.fetchedOnce = true;
                                    if (res.json().msgs && res.json().msgs.length < 20) contact.synced = true;

                                    contact.messages = [...res.json().msgs.reverse()];
                                    if (this.SelectedContact.getValue()._id == temp._id) this.SelectedContact.next(contact);
                                }
                                return contact;
                            }));
                        }
                        // console.log(this.SelectedContact.getValue());
                        // console.log(res.json());

                    }
                }, err => {
                    //Do Something
                });

            }
        }
    }

    public UnsetReadCount(contactID) {

        if (!this.settingUnreadCount[contactID]) {
            this.http.post(this.ServiceURL + '/msg_unread_count', { contactID: contactID }, { withCredentials: true }).subscribe(res => {
                // console.log(res.json().msgs);
                if (res.status == 200) {
                    this.ContactList.next(this.ContactList.getValue().map(contact => {
                        if (contact._id == contactID) {
                            contact.unreadCount = contact.unreadCount - res.json().count;
                            this.MessageUnreadCount.next((this.MessageUnreadCount.getValue() - res.json().count))
                            if (this.SelectedContact.getValue()._id == contactID) this.SelectedContact.next(contact);
                        }
                        return contact;
                    }));
                    // console.log(this.SelectedContact.getValue());
                    // console.log(res.json());
                    delete this.settingUnreadCount[contactID];
                }
            }, err => {
                //Do Something
                delete this.settingUnreadCount[contactID];
            });
        }
    }

    private GetCount() {

        this.http.post(this.ServiceURL + '/get_unread_count', { email: this.customEmail.getValue() }, { withCredentials: true }).subscribe(res => {
            if (res.status == 200) {
                this.MessageUnreadCount.next(res.json().count);
            }
        }, err => {
            // this.MessageUnreadCount.next(0)
        });

    }

    Destroy() {
        this.subscriptions.map(subscription => { subscription.unsubscribe(); })
    }

}


