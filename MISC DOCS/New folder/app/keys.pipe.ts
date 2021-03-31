import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keys'
})
export class KeysPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let keys = [];
    Object.keys(value).map(key => {
      keys.push({ name: key, details: value[key] });
    });
    return keys;
  }

}
