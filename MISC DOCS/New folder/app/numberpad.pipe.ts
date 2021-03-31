import {
  Pipe,
  PipeTransform
} from '@angular/core';
@Pipe({
  name: 'numberpad'
})
export class NumberPad implements PipeTransform {
  transform(input: any, places: any): any {
    var out = "";
    if (places) {
      	var placesLength = parseInt(places, 10);
      	var inputLength = input.toString().length;
		for (var i = 0; i < (placesLength - inputLength); i++) {
			out = '0' + out;
		}
      	out = out + input;
    }
    return out;
  }
}
