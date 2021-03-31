import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'attachmentType'
})
export class AttachmentTypePipe implements PipeTransform {

  transform(value: any): any {
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
      let extension = value.split('.')[1];

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
  }
}

// }
