import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pagination'
})
export class PaginationPipe implements PipeTransform {

  transform(value: Array<any>, startIndex: number, paginationLimit): any {
    if (!value.length) return [];
    else {
      //console.log(value.splice(startIndex, startIndex + paginationLimit));
      
      return value.splice(startIndex, startIndex + paginationLimit);
    }
  }

}
