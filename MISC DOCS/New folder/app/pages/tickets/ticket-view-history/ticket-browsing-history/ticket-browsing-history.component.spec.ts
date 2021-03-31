import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketBrowsingHistoryComponent } from './ticket-browsing-history.component';

describe('TicketBrowsingHistoryComponent', () => {
  let component: TicketBrowsingHistoryComponent;
  let fixture: ComponentFixture<TicketBrowsingHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketBrowsingHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketBrowsingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
