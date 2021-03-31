"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmojicheckPipe = void 0;
var core_1 = require("@angular/core");
var EmojicheckPipe = /** @class */ (function () {
    function EmojicheckPipe() {
    }
    EmojicheckPipe.prototype.transform = function (msg) {
        var onlyEmoji = false;
        //let emojiMatch = new RegExp(/\p(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/, 'gm');
        var keyboardRegex = new RegExp(/\w+|^[a-zA-Z0-9~`!@#\$%\^&\*\(\)_\-\+={\[\}\]\|\\:;"'<,>\.\?\/  ]+$/, 'gm');
        var regex = RegExp(/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff])|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/, 'gm');
        // let regex2 = RegExp(/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff])|[\ud800-\udbff][\udc00-\udfff])/, 'gm');
        // console.log(regex2.test(msg.trim()));
        //let hasEmoji = regex.test(msg.trim())
        if (regex.test(msg.trim())) {
            var tempMsg = msg.trim().replace(regex, '');
            if (!keyboardRegex.test(tempMsg)) {
                onlyEmoji = true;
            }
        }
        return onlyEmoji;
    };
    EmojicheckPipe = __decorate([
        core_1.Pipe({
            name: 'emojicheck'
        })
    ], EmojicheckPipe);
    return EmojicheckPipe;
}());
exports.EmojicheckPipe = EmojicheckPipe;
// import { Pipe, PipeTransform } from '@angular/core';
// @Pipe({
//     name: 'emojicheck'
// })
// export class EmojicheckPipe implements PipeTransform {
//     transform(msg: string): any {
//         let onlyEmoji = false;
//         let emojiMatch = new RegExp(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/, 'gm');
//         let keyboardRegex = new RegExp(/\w+|^[a-zA-Z0-9~`!@#\$%\^&\*\(\)_\-\+={\[\}\]\|\\:;"'<,>\.\?\/ ]+$/, 'gm')
//         if (emojiMatch.test(msg.trim())) {
//             let tempMsg = msg.trim().replace(emojiMatch, '');
//             if (!keyboardRegex.test(tempMsg)) {
//                 onlyEmoji = true;
//             }
//         }
//         return onlyEmoji;
//     }
// }
//# sourceMappingURL=emojicheck.pipe.js.map