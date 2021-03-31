import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketMsgFormComponent } from './ticket-msg-form.component';

describe('TicketMsgFormComponent', () => {
  let component: TicketMsgFormComponent;
  let fixture: ComponentFixture<TicketMsgFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketMsgFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketMsgFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
