import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddForwardTicketComponent } from './add-forward-ticket.component';

describe('AddForwardTicketComponent', () => {
  let component: AddForwardTicketComponent;
  let fixture: ComponentFixture<AddForwardTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddForwardTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddForwardTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
