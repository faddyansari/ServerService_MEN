import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByPageState'
})
export class FilterByPageStatePipe implements PipeTransform {

  transform(value: Array<any>, type: string): any {
    // console.log('FilterPipe : ', value);
    switch (type) {
      case 'browsing':
        return value.filter(item => { return ((item.state == 1 || item.state == 8) && !item.inactive) });
      case 'queued':
        return value.filter(item => { return (item.state == 2 && !item.inactive) });
      case 'chatting':
        return value.filter(item => { return (item.state == 3 && !item.inactive) });
      case 'invited':
        let temp = value.filter(item => { return ((item.state == 4 || item.state == 5) && !item.inactive) });
        // console.log(temp.length);
        return temp;
      case 'inactive':
        return value.filter(item => { return !!(item.inactive) });

    }
  }

}
