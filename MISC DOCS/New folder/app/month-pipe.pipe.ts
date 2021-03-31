import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class MonthPipePipe implements PipeTransform {

  transform(value: any, args?: any): any {
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

      return monthNames[new Date(value).getDate()];
  }

}
