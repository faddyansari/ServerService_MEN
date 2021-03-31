"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmojiComponent = void 0;
var core_1 = require("@angular/core");
var emoticons = require('../../emoji.json');
var EmojiComponent = /** @class */ (function () {
    function EmojiComponent() {
        this.emojiClicked = new core_1.EventEmitter();
        this.EmojiWrapper = false;
        this.Emojis = emoticons;
        //console.log(this.Emojis)
    }
    EmojiComponent.prototype.ngOnInit = function () {
    };
    EmojiComponent.prototype.EmojiHeader = function (selectedIcon) {
        var hostElem = this.EmojiContent.nativeElement.children;
        var lastPart = selectedIcon;
        for (var i = 0; i < hostElem.length; i++) {
            hostElem[i].className = '';
            hostElem[i].className = 'hide';
        }
        var show_element = document.getElementById((lastPart) ? lastPart : 'Smileys');
        show_element.className = '';
        show_element.className = 'show';
    };
    EmojiComponent.prototype.EmojiContentAppend = function (event) {
        //console.log(event);
        if (event.target.id.indexOf("emoji-&#x") !== -1) {
            //this.msgBody += (event.target as HTMLAnchorElement).innerText;
            //console.log((event.target as HTMLAnchorElement).innerText)
            this.emojiClicked.emit(event.target.innerText);
            this.EmojiWrapper = false;
        }
    };
    __decorate([
        core_1.ViewChild('emoji_header')
    ], EmojiComponent.prototype, "EmojiHead", void 0);
    __decorate([
        core_1.ViewChild('emoji_content')
    ], EmojiComponent.prototype, "EmojiContent", void 0);
    __decorate([
        core_1.Output()
    ], EmojiComponent.prototype, "emojiClicked", void 0);
    EmojiComponent = __decorate([
        core_1.Component({
            selector: 'app-emoji',
            templateUrl: './emoji.component.html',
            styleUrls: ['./emoji.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], EmojiComponent);
    return EmojiComponent;
}());
exports.EmojiComponent = EmojiComponent;
//# sourceMappingURL=emoji.component.js.map