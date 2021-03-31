import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketActivityLogComponent } from './ticket-activity-log.component';

describe('TicketActivityLogComponent', () => {
  let component: TicketActivityLogComponent;
  let fixture: ComponentFixture<TicketActivityLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketActivityLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketActivityLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
