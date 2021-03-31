import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'agoPipe'
})
export class AgoPipePipe implements PipeTransform {



  transform(value: any): any {
    let monthNames =
      [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
    let dateTime = Date.parse(value);
    let currentDateTime = Date.parse(new Date().toLocaleString());
    //Case For Years
    if (((currentDateTime - dateTime) / 1000 / 60 / 60) / 24 / 365 > 1) {
      return new Date(value).getDate() + ' ' + monthNames[new Date(value).getMonth()] + '\' ' + new Date(value).getFullYear().toString().slice(2, 4);
    }
    //Case For Days
    if (((currentDateTime - dateTime) / 1000 / 60 / 60) / 24 > 1) {
      return new Date(value).getDate() + ' ' + monthNames[new Date(value).getMonth()] + '\' ' + new Date(value).getFullYear().toString().slice(2, 4);
    }
    //Case For Hours
    if (((currentDateTime - dateTime) / 1000 / 60 / 60) > 1) {
      return Math.floor(((currentDateTime - dateTime) / 1000 / 60 / 60)) + ' hours ago';
    }
    //Case For Minutes
    if (((currentDateTime - dateTime) / 1000 / 60) > 1) {
      return Math.floor(((currentDateTime - dateTime) / 1000 / 60)) + ' minutes ago'
    }
    //Case For Less Then Minutes
    if (((currentDateTime - dateTime) / 1000 / 60) < 1) {
      return new Date(value).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
  }

}
