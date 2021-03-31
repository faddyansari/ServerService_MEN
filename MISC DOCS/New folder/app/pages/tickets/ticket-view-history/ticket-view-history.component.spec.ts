import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketViewHistoryComponent } from './ticket-view-history.component';

describe('TicketViewHistoryComponent', () => {
  let component: TicketViewHistoryComponent;
  let fixture: ComponentFixture<TicketViewHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketViewHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketViewHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
