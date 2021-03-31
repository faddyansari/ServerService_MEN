import {
  Pipe,
  PipeTransform
} from '@angular/core';
// import {
//   DecimalPipe
// } from '@angular/common';

@Pipe({
  name: 'urlify'
})

export class UrlifyPipe implements PipeTransform {

  transform(text: any): any {
    if(!text) return ''
    let urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, (url) => {
      return '<a href="' + url + '">' + url + '</a>';
    });
  }
}