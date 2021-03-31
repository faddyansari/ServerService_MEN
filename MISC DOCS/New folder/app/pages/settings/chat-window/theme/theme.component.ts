import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs/Observable';
import { ChatWindowCustomizations } from '../../../../../services/LocalServices/ChatWindowCustomizations';
import { UploadingService } from '../../../../../services/UtilityServices/UploadingService';
import { GlobalStateService } from '../../../../../services/GlobalStateService';

@Component({
    selector: 'app-theme',
    templateUrl: './theme.component.html',
    styleUrls: ['./theme.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ThemeComponent {
    @ViewChild('fileInput') fileInput: ElementRef;

    private subscriptions: Subscription[] = [];
    public displaySettings: any = undefined;
    private backupDisplaySettings: any = undefined;
    public form: FormGroup;
    public loading = false;

    public colorRegex = /^#[0-9a-fA-F]{8}$|#[0-9a-fA-F]{6}$|#[0-9a-fA-F]{4}$|#[0-9a-fA-F]{3}$/;
    fileValid: boolean;
    file: any = {};
    fileToUpload: File;
    uploading: any;
    deleting: boolean = false;

    constructor(private _chatWindowCustomizations: ChatWindowCustomizations,
        private _appStateService: GlobalStateService,
        private _uploadingService: UploadingService,
        public formbuilder: FormBuilder,
        public snackBar: MatSnackBar,
        public dialog: MatDialog
    ) {
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Chat Window Customizations');
       
    }

    ngOnInit() {
        this.subscriptions.push(this._chatWindowCustomizations.GetDisplaySettings().subscribe(displaySettings => {
            if (displaySettings) {

                this.displaySettings = displaySettings.settings.chatwindow.themeSettings;

                this.file = displaySettings.settings.chatwindow.themeSettings.bgImage;
                this.backupDisplaySettings = JSON.parse(JSON.stringify(displaySettings.settings.chatwindow.themeSettings));
                this.form = this.formbuilder.group({
                    'headerColor': [
                        this.displaySettings.headerColor,
                        [
                            Validators.required,
                            Validators.pattern(this.colorRegex)
                        ]
                    ],
                    'headerSecondryColor': [
                        this.displaySettings.headerSecondryColor,
                        [
                            Validators.required,
                            Validators.pattern(this.colorRegex)
                        ]
                    ],
                    'btnColor': [
                        this.displaySettings.btnColor,
                        [
                            Validators.required,
                            Validators.pattern(this.colorRegex)
                        ]
                    ],
                    'btnTextcolor': [
                        this.displaySettings.btnTextcolor,
                        [
                            Validators.required,
                            Validators.pattern(this.colorRegex)
                        ]
                    ],
                    'secondryBtnTextColor': [
                        this.displaySettings.secondryBtnTextColor,
                        [
                            Validators.required,
                            Validators.pattern(this.colorRegex)
                        ]
                    ],
                    'headerTextColor': [
                        this.displaySettings.headerTextColor,
                        [
                            Validators.required,
                            Validators.pattern(this.colorRegex)
                        ]
                    ],
                    'contentColor': [
                        this.displaySettings.contentColor,
                        [
                            Validators.required,
                            Validators.pattern(this.colorRegex)
                        ]
                    ],
                    'secondryBtnColor': [
                        this.displaySettings.secondryBtnColor,
                        [
                            Validators.required,
                            Validators.pattern(this.colorRegex)
                        ]
                    ],
                    'bgColor': [
                        this.displaySettings.bgColor,
                        [
                            Validators.required,
                            Validators.pattern(this.colorRegex)
                        ]
                    ],
                    'borderColor': [
                        this.displaySettings.borderColor,
                        [
                            Validators.required,
                            Validators.pattern(this.colorRegex)
                        ]
                    ],
                    'windowSizeForMobile': [
                        (this.displaySettings.windowSizeForMobile) ? this.displaySettings.windowSizeForMobile : 645,
                        [
                            Validators.required,
                        ]
                    ],
                    'windowSizeForDesktop': [
                        (this.displaySettings.windowSizeForDesktop) ? this.displaySettings.windowSizeForDesktop : 730,
                        [
                            Validators.required,
                        ]
                    ],
                });

            }
        }));
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.map(subscription => {
            subscription.unsubscribe();
        });
    }


    SetControl(data) {
        this.form.get(data.controlValue).setValue(data.value);
        this.displaySettings[data.controlValue] = data.value;
    }

    SetStickyWindow() {
        this.displaySettings.stickyWindow = !this.displaySettings.stickyWindow
    }

    public ColorChange(event: string, data: any) {
        this.form.get(event).setValue(this._chatWindowCustomizations.RGBAToHexAString(data));
    }


    public Reset() {
        this.displaySettings = JSON.parse(JSON.stringify(this.backupDisplaySettings));
    }

    public ResetToDefaults() {
        this.displaySettings = {
            headerColor: '#F39B64FF',
            headerSecondryColor: '#F15C24FF',
            btnColor: '#F15C24FF',
            btnTextcolor: '#FFFFFFFF',
            secondryBtnTextColor: '#FFFFFFFF',
            headerTextColor: '#FFFFFFFF',
            contentColor: '#1F282EFF',
            secondryBtnColor: '#368763FF',
            bgColor: '#FFFFFFFF',
            borderColor: '#AFB6C4FF',
            bgImage: {},
        };
    }

    public FileSelected(event: Event) {
        this.fileValid = true;
        if ((<HTMLInputElement>event.target).files[0].type) {

            if ((<HTMLInputElement>event.target).files.length > 0) {
                this.fileToUpload = (<HTMLInputElement>event.target).files[0];
                return;
            }

        } else {
            this.fileValid = false;
            this.ClearFile();

            setTimeout(() => [
                this.fileValid = true
            ], 3000);

        }
        this.fileToUpload = undefined;
        return;
    }

    public ClearFile() {
        this.deleting = true;
        this._chatWindowCustomizations.RemoveBackGroundImage().subscribe(response => {
            //TODO RESPONSE LOGIC HERE
            this.deleting = false;
        }, err => {
            //TODO ERROR LOGIC HERE
            this.deleting = false;
        });

    }

    public UploadImage() {
        if (this.fileToUpload && !this.uploading) {
            this.uploading = true;
            this._uploadingService.SignRequest(this.fileToUpload, 'uploadBackgroundImage').subscribe(response => {
                let params = JSON.parse(response.text());
                params.file = this.fileToUpload
                this._uploadingService.uploadAttachment(params).subscribe(s3response => {
                    // console.log(s3response.status);
                    if (s3response.status == '201') {
                        this._uploadingService.parseXML(s3response.text()).subscribe(json => {
                            //console.log(json.response.PostResponse.Location[0])
                            this._chatWindowCustomizations.UpdateBackgroundImage(json.response.PostResponse.Location[0], this.fileToUpload.name).subscribe(response => {
                                this.fileToUpload = undefined;
                                this.fileInput.nativeElement.value = '';
                                this.uploading = false;
                            }, err => {
                                this.uploading = false;
                            });

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
        }
    }


    public SubmitForm() {
        this.loading = true;
        this._chatWindowCustomizations.UpdateChatWindowContentSettings('themeSettings', this.displaySettings).subscribe(response => {
            this.loading = false;
            if (response.status == 'ok') {
                this.backupDisplaySettings = JSON.parse(JSON.stringify(this.displaySettings));
                //Todo Completion Logic Here
            }
        }, err => {
            this.loading = false;
            //Todo Error View Logic Here
        })
    }

    public ApplyHeaderColorWithGradient(color: string) {
        return JSON.parse(JSON.parse(JSON.stringify(`{
          "background": "linear-gradient(20deg,${this.displaySettings.headerSecondryColor} 30%, ${this.displaySettings.headerColor} 100%)"
        }`)));
    }

}