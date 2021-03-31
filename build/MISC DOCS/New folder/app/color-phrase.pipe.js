"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorPhrasePipe = void 0;
var core_1 = require("@angular/core");
var ColorPhrasePipe = /** @class */ (function () {
    function ColorPhrasePipe(sanitizer) {
        this.sanitizer = sanitizer;
    }
    ColorPhrasePipe.prototype.transform = function (phrase, entities_list, entities) {
        var replacedSTR = "";
        var wordsArray = [];
        var _loop_1 = function (i) {
            wordsArray.push({
                word: phrase.split(' ')[i],
                index: (!wordsArray.filter(function (a) { return a.word == phrase.split(' ')[i] && a.index == phrase.indexOf(phrase.split(' ')[i]); }).length) ? phrase.indexOf(phrase.split(' ')[i]) : phrase.indexOf(phrase.split(' ')[i], wordsArray[i - 1].index + 1)
            });
        };
        // console.log(phrase);
        // console.log(entities_list);
        // console.log(entities);
        for (var i = 0; i < phrase.split(' ').length; i++) {
            _loop_1(i);
        }
        if (entities.length > 0) {
            entities.map(function (e) {
                wordsArray.forEach(function (w) {
                    if (w.index == e.start && w.index < e.end && e.entity != '' && entities_list.filter(function (eL) { return eL._id == e.entity && !e.entity_del; }).length) {
                        w.word = '<span style="padding: 3px; background-color:' + entities_list.filter(function (eL) { return eL._id == e.entity; })[0].color + '">' + w.word + "</span>";
                    }
                });
            });
            //console.log(wordsArray);
        }
        else {
            return phrase;
        }
        var returnPhrase = "";
        for (var i = 0; i < wordsArray.length; i++) {
            returnPhrase = returnPhrase.concat(wordsArray[i].word + " ");
        }
        return this.sanitizer.bypassSecurityTrustHtml(returnPhrase);
    };
    ColorPhrasePipe = __decorate([
        core_1.Pipe({
            name: 'colorPhrase'
        })
    ], ColorPhrasePipe);
    return ColorPhrasePipe;
}());
exports.ColorPhrasePipe = ColorPhrasePipe;
//# sourceMappingURL=color-phrase.pipe.js.map