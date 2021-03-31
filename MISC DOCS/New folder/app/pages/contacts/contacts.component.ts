import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Contactservice } from '../../../services/ContactService';
import { Subscription } from 'rxjs/Subscription';
import { Validators, FormControl } from '@angular/forms';
import { UploadingService } from '../../../services/UtilityServices/UploadingService';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { AuthService } from '../../../services/AuthenticationService';
import { CallDialogComponent } from '../../dialogs/call-dialog/call-dialog.component';
import { CallingService } from '../../../services/CallingService';

@Component({
    selector: 'app-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ContactsComponent implements OnInit {

    // the data structure used for view
    subscriptions: Subscription[] = [];
    agent: any;
    selectedContact: any = {};
    edit = false;
    loading = false;
    showContactAccessInfo = false;
    //Editing Value
    name;
    //    last_name;
    //    nickname;
    phone_no;

    name_control;
    // last_name_control;
    // nickname_control;
    phone_no_control;
    uploading: boolean;
    initiateChat = true;
    showChat = false;
    isSelfViewingChat: any;

    selectedThread: any;
    numbersArray = Array(15).fill(0).map((x, i) => i);
    verified = true;

    showContacts = true;
    showConversations = false;
    showContactInfo = false;
    loadingContactInfo = false;
    production = false;
    sbt = false;
    constructor(
        private _contactService: Contactservice,
        private _authService: AuthService,
        private _uploadingService: UploadingService,
        private _callingService: CallingService,
        private dialog: MatDialog
    ) {
        this.subscriptions.push(_authService.getAgent().subscribe(data => {
            this.agent = data;
        }));
        this.subscriptions.push(_authService.Production.subscribe(data => {
            this.production = data;
        }));

        this.subscriptions.push(_authService.SBT.subscribe(data => {
            this.sbt = data;
        }));

        this.subscriptions.push(this._authService.getSettings().subscribe(settings => {
            if (settings && Object.keys(settings).length) this.verified = settings.verified;

        }));

        this.subscriptions.push(_contactService.selectedContact.subscribe(contact => {
            this.selectedContact = contact;
            if (Object.keys(this.selectedContact).length) {
                this.name = this.selectedContact.name;
                // this.last_name = this.selectedContact.last_name;
                // this.nickname = this.selectedContact.nickname;
                this.phone_no = this.selectedContact.phone_no;
                this.name_control = new FormControl(this.selectedContact.first_name, [Validators.required]);
                // this.last_name_control = new FormControl(this.selectedAgent.last_name, [Validators.required]);
                // this.nickname_control = new FormControl(this.selectedAgent.nickname, [Validators.required]);
                this.phone_no_control = new FormControl(this.selectedContact.phone_no, [Validators.pattern(/^[0-9\-]+$/)]);
            }
            if (this.edit) this.Cancel();
        }));


        this.subscriptions.push(_contactService.isSelfViewingChat.subscribe(data => {
            if (data) {
                this.isSelfViewingChat = data;
            }
        }));


        this.subscriptions.push(_contactService.selectedThread.subscribe(data => {
            this.selectedThread = data;
        }));
        this.subscriptions.push(_contactService.showContactInfo.subscribe(data => {
            this.showContactInfo = data;
        }));
        this.subscriptions.push(_contactService.loadingContactInfo.subscribe(data => {
            this.loadingContactInfo = data;
        }));

        this.subscriptions.push(_contactService.showContactAccessInfo.subscribe(data => {
            this.showContactAccessInfo = data;
        }));

        this.subscriptions.push(_contactService.showContacts.subscribe(data => {
            this.showContacts = data;
        }));
        this.subscriptions.push(_contactService.showConversations.subscribe(data => {
            this.showConversations = data;
        }));
    }

    ngOnInit() {

    }

    Edit() {
        this.edit = true;
    }

    Save() {
        this.loading = true;
        this._contactService.EditContact({
            _id: this.selectedContact._id,
            name: this.name,
            phone_no: this.phone_no,
            email: this.selectedContact.email
        });

    }

    Delete(id, email) {
        this.dialog.open(ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: 'Are You Sure You Want To Delete?' }
        }).afterClosed().subscribe(data => {
            if (data == 'ok') {
                this._contactService.DeleteContact(id, email);
            }
        });
    }

    Cancel() {
        this.edit = false;
        this.name = this.selectedContact.name;
        // this.last_name = this.selectedAgent.last_name;
        // this.nickname = this.selectedAgent.nickname;
        this.phone_no = this.selectedContact.phone_no;
        this.name_control = new FormControl(this.selectedContact.name, [Validators.required]);
        // this.last_name_control = new FormControl(this.selectedAgent.last_name, [Validators.required]);
        // this.nickname_control = new FormControl(this.selectedAgent.nickname, [Validators.required]);
        this.phone_no_control = new FormControl(this.selectedContact.phone_no, [Validators.pattern(/^[0-9]+$/)]);
    }

    public NumbersOnly(event: any) {
        const pattern = /[0-9\-]+/;
        let inputChar = String.fromCharCode(event.charCode);

        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
        this._contactService.setSelectedContact();
    }

    ToggleChat() {
        this._contactService.getOrcreateConversation();
        // if(!this.selectedThread){    
        //     this._contactService.getOrcreateConversation();
        // }else{
        //     if(this.selectedThread && this.selectedThread._id){
        //         this._contactService.ToggleSelfViewingChat(this.selectedThread._id);
        //     }
        // }  
    }
    toggleContactAccessInfo() {
        this._contactService.toggleContactAccessInformation();
    }

    public TryCall(selectedContact: any) {
        event.preventDefault();
        // this._callingService.dummyCallNotif();
        this.dialog.open(CallDialogComponent, {
            panelClass: ['calling-dialog'],
            data: selectedContact,
            disableClose: true,
            autoFocus: true
        }).afterClosed().subscribe(response => {
            // console.log(response);
            this._callingService.EndCall();
        });
    }

}
