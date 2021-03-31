import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
	name: 'filter'
})
export class FilterPipe implements PipeTransform {
	transform(items: any[], searchText: string, searchBy: string[], byValue = true): any[] {
		
		if (!items) return [];
		if (!searchText || !searchText.trim()) { return (byValue) ? JSON.parse(JSON.stringify(items)) : items; }
		searchText = searchText.toLowerCase();
		let filteredList = [];
		items.filter(it => {
			if(searchBy.length){
				searchBy.forEach(element => {
					
					if (element.indexOf('visitor.') != -1 && it['visitor'][element.split('.')[1]] && it['visitor'][element.split('.')[1]].toString().toLowerCase().includes(searchText)) {
						if (!filteredList.includes(it)) {
							filteredList.push(it);
						}
					}
					
					if (it[element] && it[element].toString().toLowerCase().includes(searchText)) {
						if (!filteredList.includes(it)) {
							filteredList.push(it);
						}
					}
					if (Array.isArray(it[element]))  {
						if(!filteredList.includes(it)){
							if(JSON.stringify(it[element]).toString().toLowerCase().replace(',','##').includes(searchText)){
								filteredList.push(it)
							}
						}
					} 
					if (element.split(',').length) {
						let text = element.split(',');
						// console.log(text);				
						if (it[text[0]] && it[text[0]][text[1]] && it[text[0]][text[1]].toString().toLowerCase().includes(searchText)) {
							if (!filteredList.includes(it)) {
								filteredList.push(it);
							}
						}
					}
					if(element.split('.').length > 1){
						// console.log('Array of objects search');
						
						let key1 = element.split('.')[0];
						let key2 = element.split('.')[1];
						if(Array.isArray(it[key1])){
							// console.log('Array of objects search');
							it[key1].forEach(element => {
								if(element[key2].includes(searchText)){
									if (!filteredList.includes(it)) {
										filteredList.push(it);
									}
								}
							});
						}
					}
	
				});
			}else{
				if(it.toLowerCase().includes(searchText)){
					filteredList.push(it);
				}
			}
		});
		return (byValue) ? JSON.parse(JSON.stringify(filteredList)) : filteredList;
	}
}