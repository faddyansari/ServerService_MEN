"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentTypePipe = void 0;
var core_1 = require("@angular/core");
var AttachmentTypePipe = /** @class */ (function () {
    function AttachmentTypePipe() {
    }
    AttachmentTypePipe.prototype.transform = function (value) {
        // console.log(value);
        // if (value && value.length) {
        //   value.forEach(element => {
        //         console.log(element);
        //     let extensionArr = element[0].split('.').pop();
        //     console.log(extensionArr);
        //     switch (extensionArr.toLowerCase()) {
        //       case 'png':
        //       case 'jpeg':
        //       case 'jpg':
        //         return 'image';
        //       case 'mp3':
        //       case 'mp4':
        //         return 'audio';
        //       case 'pdf':
        //       case 'docx':
        //       case 'doc':
        //       case 'txt':
        //       case 'csv':
        //         return 'document';
        //       default:
        //         return 'data';
        //     }
        //   });
        // }
        // else {
        // console.log(value);
        if (value) {
            var extension = value.split('.')[1];
            switch (extension.toLowerCase()) {
                case 'png':
                case 'jpeg':
                case 'jpg':
                case 'bmp':
                case 'svg':
                case 'gif':
                    return 'image';
                case 'mp3':
                    return 'audio';
                case 'mp4':
                case 'm4a':
                case 'm4v':
                case 'f4v':
                case 'm4b':
                case 'f4b':
                case 'mov':
                    return 'video';
                case 'pdf':
                case 'xlsx':
                case 'docx':
                case 'doc':
                case 'txt':
                case 'csv':
                    return 'document';
                default:
                    return 'data';
            }
        }
    };
    AttachmentTypePipe = __decorate([
        core_1.Pipe({
            name: 'attachmentType'
        })
    ], AttachmentTypePipe);
    return AttachmentTypePipe;
}());
exports.AttachmentTypePipe = AttachmentTypePipe;
// }
//# sourceMappingURL=attachment-type.pipe.js.map