import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dayDifferencePipe'
})
export class DayDifferencePipePipe implements PipeTransform {

  transform(value: string): any {
    let monthNames =
      [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ];
      return monthNames[new Date(value).getMonth()] + ' ' + new Date(value).getDate() + ' \' ' + new Date(value).getFullYear().toString().slice(2, 4);
      
    // let dayDifference = Math.floor((Date.parse(new Date().toDateString()) - Date.parse(new Date(value).toDateString())) / 1000 / 60 / 60 / 24);
    
    // if (dayDifference == 0) {
    //   return Date.parse(new Date().toISOString()) - Date.parse(new Date(value).toISOString());
    // } 
    // else return monthNames[new Date(value).getMonth()] + ' ' + new Date(value).getDate() + ' \' ' + new Date(value).getFullYear().toString().slice(2, 4);
  }

}
