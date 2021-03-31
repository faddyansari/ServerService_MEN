"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportExportContactsDialogComponent = void 0;
var core_1 = require("@angular/core");
var AgentService_1 = require("../../../services/AgentService");
var ImportExportContactsDialogComponent = /** @class */ (function () {
    function ImportExportContactsDialogComponent(dialogRef, formbuilder, _authService, 
    // public _contactService: Contactservice,
    _agentService) {
        var _this = this;
        this.dialogRef = dialogRef;
        this.formbuilder = formbuilder;
        this._authService = _authService;
        this._agentService = _agentService;
        // In bytes 
        this.uploadLimitSize = 5242880;
        this.subscriptions = [];
        this.nsp = undefined;
        this.submitted = false;
        this.largeFileSize = false;
        this.wrongFileType = false;
        this.permittedFileTypesForContactImport = ['xlsx', 'xls', 'csv'];
        this.importExportForm = formbuilder.group({
            'importFile': [],
            'exportFile': []
        });
        this.subscriptions.push(this._authService.Agent.subscribe(function (agent) {
            _this.nsp = agent.nsp;
        }));
    }
    ImportExportContactsDialogComponent.prototype.ngOnInit = function () {
    };
    ImportExportContactsDialogComponent.prototype.selectFile = function (event) {
        this.fileUploadHandle = event.target.files[0];
        if (this.fileUploadHandle) {
            // Give benefit of doubt until checking is done
            this.largeFileSize = false;
            this.wrongFileType = false;
        }
    };
    ImportExportContactsDialogComponent.prototype.submitImportContacts = function () {
        var _this = this;
        // console.log(this.fileUploadHandle);
        var fileType = this.fileUploadHandle.name.split('.').pop().trim().toLowerCase();
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
                this._agentService.ValidateSheet(this.fileUploadHandle).subscribe(function (data) {
                    if (data.status == 'ok') {
                        _this.dialogRef.close({
                            fileUploadHandle: _this.fileUploadHandle,
                            exportContacts: false
                        });
                    }
                    else {
                        console.log(data);
                    }
                });
            }
        }
        else {
            this.submitted = true;
        }
    };
    ImportExportContactsDialogComponent.prototype.exportContacts = function () {
        this.dialogRef.close({
            fileUploadHandle: undefined,
            exportContacts: true
        });
    };
    ImportExportContactsDialogComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
        this._agentService.Destroy();
    };
    ImportExportContactsDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-import-export-contacts-dialog',
            templateUrl: './import-export-contacts-dialog.component.html',
            styleUrls: ['./import-export-contacts-dialog.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            providers: [
                AgentService_1.AgentService,
            ]
        })
    ], ImportExportContactsDialogComponent);
    return ImportExportContactsDialogComponent;
}());
exports.ImportExportContactsDialogComponent = ImportExportContactsDialogComponent;
//# sourceMappingURL=import-export-contacts-dialog.component.js.map