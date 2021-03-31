import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { TicketsService } from './TicketsService';
import { GlobalStateService } from './GlobalStateService';

@Injectable()
export class canActivateTicketViewGuard implements CanActivate {

  constructor(private _globalApplicationState: GlobalStateService) { }

  canActivate() {
    let access = this._globalApplicationState.getTicketViewAccess();
    if (!access) this._globalApplicationState.NavigateTo('/tickets');
    return access;
  }
}