import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTicketTemplatesComponent } from './add-ticket-templates.component';

describe('AddTicketTemplatesComponent', () => {
  let component: AddTicketTemplatesComponent;
  let fixture: ComponentFixture<AddTicketTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTicketTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTicketTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
