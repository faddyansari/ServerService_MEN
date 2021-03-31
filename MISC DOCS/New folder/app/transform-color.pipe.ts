import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformColor'
})
export class TransformColorPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    console.log('In Pipe');
    console.log(value);
    return this.RGBAToHexAString(value);
  }

  public RGBAToHexAString(rgba) {
    console.log(rgba)
    if(new RegExp(/^#[0-9a-fA-F]{8}$|#[0-9a-fA-F]{6}$|#[0-9a-fA-F]{4}$|#[0-9a-fA-F]{3}$/).test(rgba)) return rgba;
    let sep = rgba.indexOf(",") > -1 ? "," : " ";
    rgba = rgba.substr(5).split(")")[0].split(sep);

    // Strip the slash if using space-separated syntax
    if (rgba.indexOf("/") > -1)
        rgba.splice(3, 1);

    for (let R in rgba) {
        let r = rgba[R];
        if (r.indexOf("%") > -1) {
            let p = r.substr(0, r.length - 1) / 100;

            if (parseInt(R) < 3) {
                rgba[R] = Math.round(p * 255);
            } else {
                rgba[R] = p;
            }
        }
    }
    console.log(this.RGBAToHexA(rgba));
    return this.RGBAToHexA(rgba);
}

private RGBAToHexA(rgba) {
    //console.log(rgba);
    let r = (+rgba[0]).toString(16),
        g = (+rgba[1]).toString(16),
        b = (+rgba[2]).toString(16),
        a = Math.round(+rgba[3] * 255).toString(16);
    if (!a) a = 'F';
    if (r.length == 1)
        r = "0" + r;
    if (g.length == 1)
        g = "0" + g;
    if (b.length == 1)
        b = "0" + b;
    if (a.length == 1)
        a = "0" + a;
    //console.log(a);

    return "#" + r + g + b + a;
}

}
