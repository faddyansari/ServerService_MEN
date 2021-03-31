import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeDifferencePipe'
})
export class TimeDifferencePipePipe implements PipeTransform {

  transform(value: string): any {
    if(value){
      let currentDate = Date.parse(new Date().toISOString()) - Date.parse(new Date(value).toISOString());
      let seconds = Math.floor((currentDate / 1000) % 60);
      let minutes = Math.floor((currentDate / 1000 / 60) % 60);
      let hours = Math.floor((currentDate / 1000) / 60 / 60);
      if (hours > 0) {
        return hours + ' Hours';
      }
      if (minutes > 0) {
        return minutes + ' Minutes';
      }
      return seconds + ' Seconds';
    }else{
      return '';
    }
  }

}
