import { Injectable, Input } from '@angular/core';

//RxJs Imsports
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
//End RxJs Imports
//Services
import { SocketService } from "../services/SocketService";
import { AuthService } from '../services/AuthenticationService';
import { utils, readFile, WorkBook, read } from 'xlsx';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../app/dialogs/confirmation-dialog/confirmation-dialog.component';
import { PushNotificationsService } from './NotificationService';
import { Http } from '@angular/http';
let xlsx = { utils: utils, readFile: readFile, read: read };

@Injectable()

export class Contactservice {
    private socket: SocketIOClient.Socket;
    public contactsList: BehaviorSubject<any> = new BehaviorSubject([]);
    public selectedContact: BehaviorSubject<any> = new BehaviorSubject({});
    public contactsCount: BehaviorSubject<any> = new BehaviorSubject([]);
    public onlineCount: BehaviorSubject<number> = new BehaviorSubject(0);
    public offlineCount: BehaviorSubject<number> = new BehaviorSubject(0);
    public showContactAccessInfo: BehaviorSubject<boolean> = new BehaviorSubject(true);

    private agent: any;

    private emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    private numberPattern = /[0-9\-]+/;

    public isSelfViewingChat: BehaviorSubject<any> = new BehaviorSubject({ chatId: '', value: false });


    //Thread revamp
    public conversationList: BehaviorSubject<any> = new BehaviorSubject([]);
    public selectedThread: BehaviorSubject<any> = new BehaviorSubject(undefined);

    public showContacts: BehaviorSubject<boolean> = new BehaviorSubject(true);
    public showConversations: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public showContactInfo: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public loadingContacts: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public loadingContactInfo: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public loadingConversation: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public sortBy: BehaviorSubject<string> = new BehaviorSubject('ALL');
    private url: any;

    constructor(
        private _socket: SocketService,
        private _authService: AuthService,
        private http: Http,
        private dialog: MatDialog,
        private _notificationService: PushNotificationsService,
        private snackBar: MatSnackBar
    ) {
        this._authService.getAgent().subscribe(agent => {
            this.agent = agent;
        });

        this._authService.getServer().subscribe(url => {
            this.url = url;
        })
        // _authService.getGroupsFromBackend();
        this._socket.getSocket().subscribe((data) => {
            if (data) {
                this.socket = data;
                this.RetrieveContacts();
                // this.GetThreadList();
                this.GetContactsCountWithStatus();
                this.GetThreadListByEmail();

                this.socket.on('contactAvailable', (response) => {
                    // console.log('Contact Avalaible');

                    this.contactsList.next(this.contactsList.getValue().map(contact => {
                        if (contact.email == response.email) {
                            contact.status = true;
                        }
                        return contact;
                    }));
                    // console.log(this.contactsCount.getValue());
                    this.contactsCount.next(this.contactsCount.getValue().map(contact => {
                        if (contact.email == response.email) {
                            contact.status = true;
                        }
                        return contact;
                    }));
                });

                this.socket.on('contactDisconnected', (response) => {
                    // console.log('Contact Disconnected');
                    this.contactsList.next(this.contactsList.getValue().map(contact => {
                        if (contact.email == response.email) {
                            contact.status = false;
                        }
                        return contact;
                    }));
                    this.contactsCount.next(this.contactsCount.getValue().map(contact => {
                        if (contact.email == response.email) {
                            contact.status = false;
                        }
                        return contact;
                    }));
                });

                this.socket.on('contactDeleted', (response) => {
                    if (response.status == 'ok') {
                        let index_list = this.contactsList.getValue().findIndex(a => a.email == response.deletedContact);
                        let index_count = this.contactsCount.getValue().findIndex(a => a.email == response.deletedContact);
                        this.contactsCount.getValue().splice(index_count, 1);
                        this.contactsCount.next(this.contactsCount.getValue());
                        if (index_list) {
                            this.contactsList.getValue().splice(index_list, 1);
                            this.contactsList.next(this.contactsList.getValue());
                        }
                        if (this.contactsList.getValue().length) {
                            this.selectedContact.next(this.contactsList.getValue()[0]);
                        } else {
                            this.selectedContact.next({});
                        }
                    }
                    // console.log(this.contactsCount.getValue().length);

                });

                this.socket.on('gotNewContact', (response) => {
                    if (this.contactsList.getValue().filter(data => data.email == response.createdContact.email).length == 0) {
                        this.contactsList.getValue().push(response.createdContact);
                        this.contactsList.next(this.contactsList.getValue());
                    }
                });

                this.socket.on('gotNewContactConversation', (data) => {
                    if (!this.conversationList.getValue().filter(c => c._id == data.conversation._id).length) {
                        this.conversationList.getValue().push(data.conversation)
                        this.conversationList.next(this.conversationList.getValue());
                    }
                });

                this.socket.on('gotNewContactMessage', (response) => {
                    // console.log("Got New Contact Message!");
                    // console.log(response);   
                    if (this.isSelfViewingChat.getValue().chatId != response.currentConversation._id || (this.isSelfViewingChat.getValue().chatId == response.currentConversation._id && !this.isSelfViewingChat.getValue().value)) {
                        if (response.currentConversation.LastSeen.filter(data => data.id == this.agent.email)[0].messageReadCount <= 1) {
                            let notif_data: Array<any> = [];
                            notif_data.push({
                                'title': response.message.from + ' says:',
                                'alertContent': response.message.body,
                                'icon': "../assets/img/favicon.ico",
                                'url': "/contacts"
                            });
                            this._notificationService.generateNotification(notif_data);
                        }
                    }
                    let index = this.conversationList.getValue().findIndex(obj => obj._id == response.currentConversation._id);
                    this.conversationList.getValue()[index] = response.currentConversation;
                    this.conversationList.next(this.conversationList.getValue());
                    if (this.selectedThread.getValue()._id == response.currentConversation._id) {
                        this.selectedThread.getValue().messages.push(response.message);
                        this.selectedThread.next(this.selectedThread.getValue());
                        if (this.isSelfViewingChat.getValue().chatId == response.currentConversation._id && this.isSelfViewingChat.getValue().value) {
                            this.seenConversation(response.currentConversation._id);
                        }
                    }

                    // let notif_data: Array<any> = [];
                    // notif_data.push({
                    //   'title': 'New Message!',
                    //   'alertContent': 'You have received a new message!',
                    //   'icon': "../assets/img/favicon.ico",
                    //   'url': "/chats"
                    // });
                    // if (this.showNotification) {
                    //   this._notificationService.generateNotification(notif_data);
                    // }
                });

                this.socket.on('contactConversationSeen', (response) => {
                    // console.log('Conversation Seen!');                                
                    if (this.selectedThread.getValue()) {
                        let thread = this.selectedThread.getValue();
                        thread.LastSeen = response.LastSeen;
                        this.selectedThread.next(thread);
                    }
                    // this.getAllAgentConversations();
                });

            }
        });
    }

    ToggleSelfViewingChat(chatId) {
        this.isSelfViewingChat.next({
            chatId: chatId,
            value: true
        });
        if (this.isSelfViewingChat.getValue().value) {
            this.seenConversation(chatId);
        }
        this.sortBy.next('');
        this.showContacts.next(false);
        this.showConversations.next(true);
    }

    public GetContactsCountWithStatus() {
        this.socket.emit("getContactsCount", { nsp: this.agent.nsp }, response => {
            if (response.status == 'ok' && response.contactsList.length) {
                this.contactsCount.next(response.contactsList);
                //   console.log(this.contactsCount.getValue().length);
                //   this.onlineCount.next(this.contactsCount.getValue().filter(a => a.status == true).length);
                //   this.offlineCount.next(this.contactsCount.getValue().filter(a => a.status == false).length);
            }
        });
    }

    public RetrieveContacts(lastContactId = '0', type = 'ALL') {
        this.loadingContacts.next(true);
        this.socket.emit("retrieveContactsAsync", { nsp: this.agent.nsp, chunk: lastContactId, type: type }, response => {
            // console.log(response);
            if (response.status == 'ok') {
                if (this.contactsList.getValue().length && !this.contactsList.getValue().ended) {
                    if (response.contactsList.length) {
                        response.contactsList.forEach(contact => {
                            if (!this.contactsList.getValue().filter(a => a._id == contact._id).length) {
                                this.contactsList.getValue().push(contact);
                            }
                            this.contactsList.getValue().ended = response.ended;
                        });
                        this.contactsList.next(this.contactsList.getValue());
                    } else {
                        this.contactsList.next([]);
                    }
                    // console.log(this.contactsList.getValue().length);                          
                } else {
                    this.contactsList.next(response.contactsList);
                }
            }
            // console.log(this.contactsList.getValue().length);
            this.loadingContacts.next(false);
        });
    }

    public getOrcreateConversation() {
        let data: any = {
            toContact: this.selectedContact.getValue().email,
            toName: this.selectedContact.getValue().name,
            fromContact: this.agent.email,
            fromName: this.agent.first_name + ' ' + this.agent.last_name
        };
        this.socket.emit('createContactConversation', { conBody: data }, (response) => {
            if (response.status == 'ok' && response.conversation) {
                // console.log(response);
                this.selectedThread.next(response.conversation);
                this.isSelfViewingChat.next({
                    chatId: response.conversation._id,
                    value: true
                });
                this.seenConversation(response.conversation._id);
                if (!this.conversationList.getValue().filter(c => c._id == response.conversation._id).length) {
                    this.conversationList.getValue().push(response.conversation);
                    this.conversationList.next(this.conversationList.getValue());
                }
                this.showContacts.next(false);
                this.showConversations.next(true);
                this.sortBy.next('');
            }
        });
    }

    public setSelectedContact(id?, cid?) {
        this.loadingContactInfo.next(true);
        if (id) {
            // console.log(id);
            if (this.contactsList.getValue().filter(a => a._id == id).length) {
                this.contactsList.getValue().map(contact => {
                    if (contact._id == id) {
                        this.selectedContact.next(contact);
                        this.showContactInfo.next(true);
                        if (cid) {
                            // console.log('CID: ' + cid);                      
                            this.isSelfViewingChat.next({
                                chatId: cid,
                                value: false
                            });
                        }
                    }
                });
                this.loadingContactInfo.next(false);
            } else {
                this.socket.emit('getContactByID', { id: id }, (response) => {
                    if (response && response.contact) {
                        this.selectedContact.next(response.contact);
                        this.showContactInfo.next(true);
                        if (cid) {
                            // console.log('CID: ' + cid);                      
                            this.isSelfViewingChat.next({
                                chatId: cid,
                                value: false
                            });
                        }
                    }
                    this.loadingContactInfo.next(false);
                });
            }
        } else {
            this.selectedContact.next({});
            this.showContacts.next(true);
            this.sortBy.next('ALL');
            this.showConversations.next(false);
            this.loadingContactInfo.next(false);
            this.selectedThread.next(undefined);
            this.isSelfViewingChat.next({
                chatId: '',
                value: false
            });
        }
    }

    public CreateContact(contact) {
        // console.log(contact);
        if (this.contactsList.getValue().filter(c => c.email == contact.email).length > 0) {
            this.dialog.open(ConfirmationDialogComponent, {
                panelClass: ['confirmation-dialog'],
                data: { headermsg: 'Contact already exists do you want to update?' }
            }).afterClosed().subscribe(data => {
                if (data == 'ok') {
                    this.socket.emit("createContact", (contact), (resp) => {
                        if (resp.status == "ok") {
                            let index = this.contactsList.getValue().findIndex(c => c.email == resp.contact.email);
                            this.contactsList.getValue()[index] = resp.contact;
                            this.contactsList.next(this.contactsList.getValue());
                        }
                        else {
                            console.log('Error encountered in creating contact');
                        }
                    });
                } else {

                }
            });
        } else {
            this.socket.emit("createContact", (contact), (resp) => {
                if (resp.status == "ok") {
                    this.contactsList.getValue().splice(0, 0, resp.contact);
                    this.contactsList.next(this.contactsList.getValue());
                    this.contactsCount.getValue().push({
                        _id: resp.contact._id,
                        email: resp.contact.email,
                        status: resp.contact.status
                    });
                    this.contactsCount.next(this.contactsCount.getValue());
                }
                else {
                    console.log('Error encountered in creating contact');
                }
            });
        }

    }

    public SendMessageToContact(message) {
        this.socket.emit('insertContactMessage', { message: message }, (response) => {
            if (response.status == 'ok') {
                this.selectedThread.getValue().messages.push(response.message);
                this.selectedThread.getValue().LastSeen = response.currentConversation.LastSeen;
                this.selectedThread.next(this.selectedThread.getValue());
                // let index = this.threadList.getValue().findIndex(obj => obj._id == response.currentConversation._id);
                // this.threadList.getValue()[index] = response.currentConversation;
                // this.threadList.next(this.threadList.getValue());    
                let conversation = this.conversationList.getValue().findIndex(obj => obj._id == response.currentConversation._id);
                this.conversationList.getValue()[conversation] = response.currentConversation;
                this.conversationList.next(this.conversationList.getValue());
            }
        })
    }

    public seenConversation(cid) {
        // console.log(this.conversationList.getValue());
        // console.log((this.selectedThread.getValue().to == this.agent.email) ? this.selectedThread.getValue().from : this.selectedThread.getValue().to);

        this.socket.emit('seenContactConversation', { cid: cid, userId: this.agent.email, to: (this.selectedThread.getValue().to == this.agent.email) ? this.selectedThread.getValue().from : this.selectedThread.getValue().to }, (response) => {
            if (response.status == 'ok') {
                let index = this.conversationList.getValue().findIndex(obj => obj._id == response.currentConversation._id);
                this.conversationList.getValue()[index] = response.currentConversation;
                this.conversationList.next(this.conversationList.getValue());
            }

        });
    }

    public EditContact(contact) {
        this.socket.emit("editContact", contact, (resp) => {
            if (resp.status == "ok") {
                this.contactsList.getValue().filter(contact => {
                    if (resp.updatedContact._id.toString() == contact._id.toString()) {
                        contact.name = resp.updatedContact.name;
                        contact.email = resp.updatedContact.email;
                        contact.phone_no = resp.updatedContact.phone_no;
                        this.selectedContact.next(resp.updatedContact);
                        return true;
                    }
                });

            }
            else {
                console.log('Error encountered in editting contact');
            }
        });
    }

    public DeleteContacts(ids) {
        // Convert ids into a list
        let idsArray: Array<any> = Object.keys(ids);

        // remove keys which had the value false
        let filteredArray = idsArray.filter((e) => {
            return ids[e];
        })

        // console.log(filteredArray);

        this.socket.emit("deleteContacts", filteredArray, (resp) => {
            if (resp.status == "ok") {
                let filteredContactList = this.contactsList.getValue().filter((e) => {
                    // console.log('e._id.toString()')
                    // console.log(e._id.toString())
                    if (filteredArray.includes(e._id.toString())) {
                        return false;
                    }
                    else {
                        return true;
                    }
                });

                // console.log('filteredContactList')
                // console.log(filteredContactList)

                this.contactsList.next(filteredContactList);
            }
            else {
                console.log('Error encountered in deleting contacts');
            }
        });
    }

    public DeleteContact(id, email) {
        this.socket.emit('deleteContact', { id: id, email: email }, (response) => {
            if (response.status == 'ok') {
                let index_list = this.contactsList.getValue().findIndex(a => a.email == response.deletedContact);
                let index_count = this.contactsCount.getValue().findIndex(a => a.email == response.deletedContact);
                this.contactsCount.getValue().splice(index_count, 1);
                this.contactsCount.next(this.contactsCount.getValue());
                this.contactsList.getValue().splice(index_list, 1);
                this.contactsList.next(this.contactsList.getValue());
                if (this.contactsList.getValue().length) {
                    this.selectedContact.next(this.contactsList.getValue()[0]);
                } else {
                    this.selectedContact.next({});
                }
                // console.log(this.contactsCount.getValue().length);
            }
        });
    }

    public UploadContacts(fileElement) {
        try {
            let localFileReader: any = new FileReader();
            let contacts = [];
            // Local manipulations to uploaded files
            localFileReader.onload = (event) => {
                // console.log('LocalFileReader On LOAD');
                let workbook: WorkBook = xlsx.read(new Uint8Array(event.target.result), { type: "array" });
                let Sheets = workbook.Sheets;
                let sheetNames = Object.keys(Sheets);

                let ISODate: string = (new Date()).toISOString();
                sheetNames.forEach((sheetName) => {
                    let sheet = Sheets[sheetName];

                    // parse each sheet and add to db
                    // return if sheet is empty
                    if (!sheet['!ref'])
                        return;

                    let sheetObj = xlsx.utils.sheet_to_json(sheet, { raw: false });

                    sheetObj.forEach((row) => {
                        let rowClean = this.lowercaseObjKeys(row);
                        // console.log(rowClean);

                        // email MUST be included in the row
                        if (rowClean['group'] && (rowClean['group'].toString().toLowerCase() == 'engro' || rowClean['group'].toString().toLowerCase() == 'poc')) {
                            // console.log('Inside IF');

                            let contact = {
                                email: (rowClean['email id'] ? this.testRegExp(this.emailPattern, rowClean['email id']) : ''),
                                phone_no: (rowClean['contact number'] ? this.testRegExp(this.numberPattern, rowClean['contact number']) : ''),
                                designation: (rowClean['designation'] ? rowClean['designation'] : ''),
                                name: (rowClean['name'] ? rowClean['name'] : ''),
                                image: (rowClean['image'] ? rowClean['image'] : ''),
                                extension: (rowClean['extension'] ? rowClean['extension'] : ''),
                                lineManager: (rowClean['line manager'] ? rowClean['line manager'] : ''),
                                location: (rowClean['location'] ? rowClean['location'] : ''),
                                supportApps: (rowClean['support applications'] ? rowClean['support applications'] : ''),
                                group: (rowClean['group'] ? rowClean['group'] : ''),
                                subGroup: (rowClean['subgroup'] ? rowClean['subgroup'] : ''),
                                created_date: ISODate,
                                nsp: this.agent.nsp,
                                status: false
                            };

                            contacts.push(contact);

                        } else if (rowClean['email'] && this.emailPattern.test(rowClean['email'])) {
                            let contact = {
                                email: (rowClean['email'] ? this.testRegExp(this.emailPattern, rowClean['email']) : ''),
                                phone_no: (rowClean['contact number'] ? this.testRegExp(this.numberPattern, rowClean['contact number']) : ''),
                                image: (rowClean['image'] ? rowClean['image'] : ''),
                                name: (rowClean['name'] ? rowClean['name'] : ''),
                                designation: (rowClean['designation'] ? rowClean['designation'] : ''),
                                lineManager: (rowClean['line manager'] ? rowClean['line manager'] : ''),
                                department: (rowClean['department'] ? rowClean['department'] : ''),
                                group: (rowClean['group'] ? rowClean['group'] : ''),
                                level: (rowClean['weightage'] ? Number(rowClean['weightage']) : 0),
                                extension: (rowClean['extension'] ? rowClean['extension'] : ''),
                                created_date: ISODate,
                                nsp: '/hrm.sbtjapan.com',
                                status: false
                            };

                            contacts.push(contact);
                        }
                    });
                });
            }

            localFileReader.onloadend = (event) => {
                // console.log('on load Ended!');
                // console.log(contacts);
                if (this.contactsList.getValue().length && contacts.length) {
                    //Check if duplicate contact exist. If yes , then prompt the user for updation.
                    if (this.contactsList.getValue().some(data => contacts.filter(element => element.email == data.email).length > 0)) {
                        //     console.log('Duplicate Found!');
                        //     //Prompt User 
                        this.dialog.open(ConfirmationDialogComponent, {
                            panelClass: ['confirmation-dialog'],
                            data: { headermsg: 'Duplicate contacts found! Do you want to update them?' }
                        }).afterClosed().subscribe(data => {
                            if (data == 'ok') {
                                this.ImportContactsWithUpdate(contacts, this.agent.nsp);
                            } else {
                                this.ImportContacts(contacts, '/hrm.sbtjapan.com');
                            }
                        });
                    } else {
                        this.ImportContacts(contacts, '/hrm.sbtjapan.com');
                    }
                    //If updation is true, Emit ImportWithUpdate
                    //Else Do a normal Import.
                } else {
                    //ImportContacts as it is.
                    this.ImportContacts(contacts, '/hrm.sbtjapan.com');
                }

            }
            localFileReader.readAsArrayBuffer(fileElement);
        }
        catch (err) {
            // console.log("Error encountered in importing contacts");
            // console.log(err);
        }

    }

    // Returns object with all keys cleaned -> lowercase and stripped of whitespace
    private lowercaseObjKeys(obj: Object) {
        let keys = Object.keys(obj);
        keys.forEach((key) => {
            let keyClean = key.toLowerCase().trim();

            // do nothing if the clean key is the same as the original key
            if (keyClean === key)
                return;
            obj[keyClean] = obj[key];
            delete obj[key];
            // console.log("key: " + key);
            // console.log("keyClean: " + keyClean);
        })

        return obj;
    }

    // Returns original string to be tested if pattern tests true for string
    // otherwise returns empty string 
    private testRegExp(regexPattern: RegExp, tested: string) {
        if (regexPattern.test(tested)) {
            return tested;
        }
        else {
            return '';
        }
    }

    ImportContacts(data, nsp) {
        // console.log('Ready to Emit');
        // console.log(data);
        this.socket.emit('importContacts', { contacts: data, nsp: nsp }, (response) => {
            // console.log(response);

            if (response.status == 'ok') {
                this.contactsList.next(response.contactList);
                this.GetContactsCountWithStatus();
            } else {
                this.contactsList.next([]);
            }
        });
    }

    ImportContactsWithUpdate(data, nsp) {
        this.socket.emit('importContactsWithUpdate', { contacts: data, nsp: nsp }, (response) => {
            if (response.status == 'ok') {
                this.contactsList.next(response.contactList);
                this.GetContactsCountWithStatus();
            }
        });
    }

    toggleContactAccessInformation() {
        this.showContactAccessInfo.next(!this.showContactAccessInfo.getValue());
    }

    //Thread Work
    GetThreadByCid(conversation) {
        this.loadingConversation.next(true);
        this.selectedThread.next(conversation);
        this.socket.emit('getThreadByCid', { cid: conversation._id.toString() }, (response) => {
            if (response.status == 'ok' && response.conversation) {
                // console.log(response);
                this.selectedThread.getValue().messages = response.conversation[0].messages;
                this.selectedThread.next(this.selectedThread.getValue());
                this.loadingConversation.next(false);
                this.isSelfViewingChat.next({
                    chatId: response.conversation[0]._id,
                    value: true
                });
                this.seenConversation(response.conversation[0]._id);
            }
        });
    }
    GetContactByEmail(email) {
        // this.loadingConversation.next(true);
        this.loadingContactInfo.next(true);
        if (this.selectedContact.getValue().email != email) {
            this.socket.emit('getContactByEmail', { email: email }, (response) => {
                if (response.status == 'ok' && response.contact) {
                    // console.log(response);
                    this.selectedContact.next(response.contact);
                }
            });
            this.loadingContactInfo.next(false);
        } else {
            this.loadingContactInfo.next(false);
        }
    }
    // GetThreadList(){
    //     this.socket.emit('getAllContactConversations', {}, (response) => {
    //         // console.log(response);
    //         if(response.status == 'ok' && response.conversations.length){
    //             this.threadList.next(response.conversations);
    //         }else{
    //             this.threadList.next([]);
    //         }
    //     });
    // }
    GetThreadListByEmail() {
        this.socket.emit('getThreadList', { email: this.agent.email }, (response) => {
            // console.log(response);
            if (response.status == 'ok' && response.conversations.length) {
                this.conversationList.next(response.conversations);
            } else {
                this.conversationList.next([]);
            }
        });
    }

    GetMoreMessages(cid, lastMessageId = '0') {
        // console.log(lastMessageId);

        this.socket.emit('getMoreMessages', { cid: cid, chunk: lastMessageId }, (response) => {
            // console.log('Get More Messages');
            if (response.status == 'ok' && response.messages.length) {
                if (!this.selectedThread.getValue().ended) {
                    response.messages.forEach(msg => {
                        this.selectedThread.getValue().messages.splice(0, 0, msg);
                        this.selectedThread.getValue().ended = response.ended;
                    });
                    this.selectedThread.next(this.selectedThread.getValue());
                }

            }
        });
    }

    updateStatus(email, status) {
        this.socket.emit('updateStatus', { email: email, status: status }, (response) => {
            // console.log('Get More Messages');
        });
    }

    public SearchContact(keyword, chunk = '0'): Observable<any> {
        this.loadingContacts.next(true);
        console.log('Searching contact on server...');
        return this.http.post(this.url + '/contact/searchContact/', {
            keyword: keyword,
            nsp: this.agent.nsp,
            chunk: chunk
        })
            .map((response) => {
                this.loadingContacts.next(false);
                return response.json()
            })
            .catch(err => {
                this.loadingContacts.next(false);
                return Observable.throw(err);
            })
    }

    //Typing State Events

    public StartedTyping(cid, to, from) {
        this.socket.emit('typingStarted', { cid: cid, to: to, from: from }, (response) => {

        })
    }
    public PausedTyping(cid, to, from) {
        this.socket.emit('typingPaused', { cid: cid, to: to, from: from }, (response) => {

        })
    }
}
