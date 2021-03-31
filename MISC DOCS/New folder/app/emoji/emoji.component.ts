import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
const emoticons = require('../../emoji.json');

@Component({
  selector: 'app-emoji',
  templateUrl: './emoji.component.html',
  styleUrls: ['./emoji.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmojiComponent implements OnInit {
  @ViewChild('emoji_header') EmojiHead: ElementRef;
  @ViewChild('emoji_content') EmojiContent: ElementRef;
  @Output() public emojiClicked = new EventEmitter<String>()


  public Emojis: any;
  EmojiWrapper: boolean = false;


  constructor() {
    this.Emojis = emoticons;
    //console.log(this.Emojis)
  }

  ngOnInit() {
  }
  public EmojiHeader(selectedIcon: string) {


    const hostElem = this.EmojiContent.nativeElement.children;
    let lastPart = selectedIcon;

    for (var i = 0; i < hostElem.length; i++) {
      hostElem[i].className = ''
      hostElem[i].className = 'hide'
    }
    var show_element = document.getElementById((lastPart) ? lastPart : 'Smileys');
    show_element.className = '';
    show_element.className = 'show';
  }

  public EmojiContentAppend(event: Event) {
    //console.log(event);
    if ((event.target as HTMLElement).id.indexOf("emoji-&#x") !== -1) {
      //this.msgBody += (event.target as HTMLAnchorElement).innerText;
      //console.log((event.target as HTMLAnchorElement).innerText)
      this.emojiClicked.emit((event.target as HTMLAnchorElement).innerText);
      this.EmojiWrapper = false;
    }
  }
}
