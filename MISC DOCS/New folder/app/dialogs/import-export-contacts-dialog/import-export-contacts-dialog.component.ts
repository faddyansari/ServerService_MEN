import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../services/AuthenticationService';
import { AgentService } from '../../../services/AgentService';
import { Contactservice } from '../../../services/ContactService';

@Component({
    selector: 'app-import-export-contacts-dialog',
    templateUrl: './import-export-contacts-dialog.component.html',
    styleUrls: ['./import-export-contacts-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers:[
        AgentService,
        // Contactservice
    ]
})
export class ImportExportContactsDialogComponent implements OnInit {

    public fileUploadHandle: File;
    public importExportForm: FormGroup;

    // In bytes 
    private uploadLimitSize = 5242880;

    public subscriptions: Subscription[] = [];
    public nsp = undefined;

    public submitted = false;
    public largeFileSize = false;
    public wrongFileType = false;

    public permittedFileTypesForContactImport = ['xlsx', 'xls', 'csv']

    constructor(
        private dialogRef: MatDialogRef<ImportExportContactsDialogComponent>,
        private formbuilder: FormBuilder,
        public _authService: AuthService,
        // public _contactService: Contactservice,
        public _agentService: AgentService,
    ) {
        this.importExportForm = formbuilder.group({
            'importFile': [],
            'exportFile': []
        });

        this.subscriptions.push(this._authService.Agent.subscribe(agent => {
            this.nsp = agent.nsp;
        }));

    }

    ngOnInit() {
    }

    selectFile(event) {
        this.fileUploadHandle = event.target.files[0];
        if (this.fileUploadHandle) {
            // Give benefit of doubt until checking is done
            this.largeFileSize = false;
            this.wrongFileType = false;
        }
    }

    submitImportContacts() {
        // console.log(this.fileUploadHandle);
        let fileType = this.fileUploadHandle.name.split('.').pop().trim().toLowerCase();
        // console.log(fileType)
        if (this.fileUploadHandle) {
            if (this.permittedFileTypesForContactImport.indexOf(fileType) === -1) {
                // console.log("wrong filetype")
                this.wrongFileType = true;
            }
            else if (this.fileUploadHandle.size >= this.uploadLimitSize) {
                // console.log("File too large!") 
                this.largeFileSize = true;
            }
            // Check if the extension is correct
            else {
                // console.log("Upload File");
                // this.subscriptions.push(this._authService.getAgent().subscribe((agent) => {
                //     this._contactService.UploadContacts(this.fileUploadHandle);

                //     this.dialogRef.close({
                //         status: true,
                //     }); 
                // }));
                this._agentService.ValidateSheet(this.fileUploadHandle).subscribe(data => {
                    if(data.status == 'ok'){
                        this.dialogRef.close({
                            fileUploadHandle: this.fileUploadHandle,
                            exportContacts: false
                        });
                    }else{
                        console.log(data);
                        
                    }
                });
               
            }
        }
        else {
            this.submitted = true;
        }
    }

    exportContacts() {

        this.dialogRef.close({
            fileUploadHandle: undefined,
            exportContacts: true
        });
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.map(subscription => {
            subscription.unsubscribe();
        });
        this._agentService.Destroy();
    }
}
