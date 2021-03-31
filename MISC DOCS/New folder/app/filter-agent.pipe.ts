import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter-agent'
})
export class FilterAgentPipe implements PipeTransform {
  transform( searchAgent: string, ticket: any[]): any[] {
      console.log(searchAgent);
      console.log(ticket);
      
      
    if (!searchAgent) return [];
    searchAgent = searchAgent.toLowerCase();

    // if (!searchText) { return (byValue) ? JSON.parse(JSON.stringify(items)) : items; }
    // searchText = searchText.toLowerCase();
    // let filteredList = [];
    // items.filter(it => {
    //   searchBy.forEach(element => {
    //     if (it[element] &&  it[element].toString().toLowerCase().includes(searchText)) {
    //       if (!filteredList.includes(it)) {
    //         filteredList.push(it);
    //       }
    //     }
    //   });
    // });
    // return (byValue) ?  JSON.parse(JSON.stringify(filteredList)) : filteredList;
    return
  }
}