import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, Input, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';


@Component({
	selector: 'app-blob-attachment',
	templateUrl: './blob-attachment.component.html',
	styleUrls: ['./blob-attachment.component.scss'],
	encapsulation: ViewEncapsulation.None,
	// changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlobAttachmentComponent implements OnInit {
	@Input() fileArray: Array<any> = [];
	@Input() uploading: boolean;
	@Input() fileValid: boolean;
	@Input() files: Array<any> = [];
	@Input() fileerror: string;
	@Input() errorFile: Array<any> = [];;
	//action Forms
	@Input() actionForm: any;
	@Output() onClear = new EventEmitter();
	imagetarget: any;

	constructor() {


	}

	ngOnInit() {
		//console.log("filerror", this.errorFile,this.fileerror);
		
		}

	ngAfterViewInit() {

		// if(this.files){
		// 	this.readURL(this.files).subscribe(response => {
		// 		if (response.status == 'ok') {

		// 		}
		// 	});
		// }
	}

	RemoveFile(data) {
		// console.log('Removing FIle : ', data);
		this.fileArray.forEach((e, i) => {
			if (e.name == data.name ) {
			// if (e.name == data.name || e.name == data.file.name) {
				this.fileArray.splice(i, 1);
			}
		});
		if (!this.fileArray.length && !this.files.length) {
			// console.log('Clearing');
			this.onClear.emit({ clear: true, clearAll: true });
		}else{
			this.onClear.emit({ clear: true, clearAll: false, fileToRemove: data });
		}
	}

	RemoveForm() {
		this.onClear.emit({ clearActionForm: true });
	}

	ngOnDestroy() {
		this.onClear.emit({ clear: true });
	}
}
