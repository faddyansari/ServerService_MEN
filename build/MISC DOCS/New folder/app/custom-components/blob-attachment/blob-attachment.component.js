"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlobAttachmentComponent = void 0;
var core_1 = require("@angular/core");
var BlobAttachmentComponent = /** @class */ (function () {
    function BlobAttachmentComponent() {
        this.fileArray = [];
        this.files = [];
        this.errorFile = [];
        this.onClear = new core_1.EventEmitter();
    }
    ;
    BlobAttachmentComponent.prototype.ngOnInit = function () {
        //console.log("filerror", this.errorFile,this.fileerror);
    };
    BlobAttachmentComponent.prototype.ngAfterViewInit = function () {
        // if(this.files){
        // 	this.readURL(this.files).subscribe(response => {
        // 		if (response.status == 'ok') {
        // 		}
        // 	});
        // }
    };
    BlobAttachmentComponent.prototype.RemoveFile = function (data) {
        var _this = this;
        // console.log('Removing FIle : ', data);
        this.fileArray.forEach(function (e, i) {
            if (e.name == data.name) {
                // if (e.name == data.name || e.name == data.file.name) {
                _this.fileArray.splice(i, 1);
            }
        });
        if (!this.fileArray.length && !this.files.length) {
            // console.log('Clearing');
            this.onClear.emit({ clear: true, clearAll: true });
        }
        else {
            this.onClear.emit({ clear: true, clearAll: false, fileToRemove: data });
        }
    };
    BlobAttachmentComponent.prototype.RemoveForm = function () {
        this.onClear.emit({ clearActionForm: true });
    };
    BlobAttachmentComponent.prototype.ngOnDestroy = function () {
        this.onClear.emit({ clear: true });
    };
    __decorate([
        core_1.Input()
    ], BlobAttachmentComponent.prototype, "fileArray", void 0);
    __decorate([
        core_1.Input()
    ], BlobAttachmentComponent.prototype, "uploading", void 0);
    __decorate([
        core_1.Input()
    ], BlobAttachmentComponent.prototype, "fileValid", void 0);
    __decorate([
        core_1.Input()
    ], BlobAttachmentComponent.prototype, "files", void 0);
    __decorate([
        core_1.Input()
    ], BlobAttachmentComponent.prototype, "fileerror", void 0);
    __decorate([
        core_1.Input()
    ], BlobAttachmentComponent.prototype, "errorFile", void 0);
    __decorate([
        core_1.Input()
    ], BlobAttachmentComponent.prototype, "actionForm", void 0);
    __decorate([
        core_1.Output()
    ], BlobAttachmentComponent.prototype, "onClear", void 0);
    BlobAttachmentComponent = __decorate([
        core_1.Component({
            selector: 'app-blob-attachment',
            templateUrl: './blob-attachment.component.html',
            styleUrls: ['./blob-attachment.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], BlobAttachmentComponent);
    return BlobAttachmentComponent;
}());
exports.BlobAttachmentComponent = BlobAttachmentComponent;
//# sourceMappingURL=blob-attachment.component.js.map