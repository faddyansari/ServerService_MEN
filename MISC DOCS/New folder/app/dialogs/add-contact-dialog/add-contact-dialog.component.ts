import { Component, OnInit, ViewEncapsulation, Directive } from '@angular/core';
import { FormGroup, FormBuilder, Validators, Form } from '@angular/forms';
import { AuthService } from '../../../services/AuthenticationService';
import { MatDialogRef } from '@angular/material/dialog';
import { SocketService } from '../../../services/SocketService';

@Component({
    selector: 'app-add-contact-dialog',
    templateUrl: './add-contact-dialog.component.html',
    styleUrls: ['./add-contact-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddContactDialogComponent {

    private emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    public loading = false;

    public contactRegForm: FormGroup;

    public isEmailUnique: Boolean = true;

    constructor(public _authService: AuthService,
        private formbuilder: FormBuilder,
        private dialogRef: MatDialogRef<AddContactDialogComponent>,
        private _socket: SocketService
    ) {
        this.contactRegForm = formbuilder.group({
            'name': [null, Validators.required],
            'phone_no': ['',
                [
                    Validators.pattern(/^[0-9\-]+$/),
                    Validators.required
                ]
            ],
            'email': ['',
                [
                    Validators.pattern(this.emailPattern),
                    Validators.required
                ]
            ],

        });
    }

    ngOnInit() { }

    ngAfterViewInit() { }

    ngOnDestroy() { }

    public NumbersOnly(event: any) {
        const pattern = /[0-9\-]+/;
        let inputChar = String.fromCharCode(event.charCode);

        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }

    submitForm(form: Form) {
        //this.contactRegForm.valid
        if (this.contactRegForm.valid) {
            let contact = {
                name: this.contactRegForm.get('name').value,
                phone_no: this.contactRegForm.get('phone_no').value,
                email: this.contactRegForm.get('email').value,
                image: null
            }
            this.dialogRef.close(contact);
        }
    }

    Close(event : Event){
        this.dialogRef.close();
    }

}