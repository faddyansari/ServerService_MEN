import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Pipe({
	name: 'colorPhrase'
})

export class ColorPhrasePipe implements PipeTransform {

	constructor(private sanitizer: DomSanitizer) {

	}

	transform(phrase: string, entities_list: any, entities: any): SafeHtml {
		let replacedSTR = "";
		let wordsArray = [];
		// console.log(phrase);
		// console.log(entities_list);
		// console.log(entities);
		for(let i = 0; i < phrase.split(' ').length;i++){
			wordsArray.push({
				word: phrase.split(' ')[i],
				index: (!wordsArray.filter(a => a.word == phrase.split(' ')[i] && a.index == phrase.indexOf(phrase.split(' ')[i])).length) ? phrase.indexOf(phrase.split(' ')[i]) : phrase.indexOf(phrase.split(' ')[i], wordsArray[i - 1].index + 1)
				
			});
			
		}
		
		

		if (entities.length > 0) {
			entities.map(e=> {
				wordsArray.forEach(w=>{
					if(w.index == e.start  && w.index < e.end && e.entity != '' && entities_list.filter(eL=>eL._id==e.entity && !e.entity_del).length){
						
						w.word = '<span style="padding: 3px; background-color:'+entities_list.filter(eL=>eL._id==e.entity)[0].color+'">'+w.word+"</span>";
					}
				})
			})

		//console.log(wordsArray);
		} else {
			
			return phrase;
		}

		let returnPhrase = "";
		for(let i = 0; i < wordsArray.length;i++){
			returnPhrase = returnPhrase.concat(wordsArray[i].word+ " ");
		}
		return this.sanitizer.bypassSecurityTrustHtml(returnPhrase);
	}

}
