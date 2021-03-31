import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GlobalStateService } from '../../../../services/GlobalStateService';

@Component({
  selector: 'app-keyboard-shortcuts',
  templateUrl: './keyboard-shortcuts.component.html',
  styleUrls: ['./keyboard-shortcuts.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class KeyboardShortcutsComponent implements OnInit {

  constructor(private _appStateService : GlobalStateService) {

    this._appStateService.contentInfo.next('');
    this._appStateService.breadCrumbTitle.next('General Settings');
   }

  ngOnInit() {
  }

}
