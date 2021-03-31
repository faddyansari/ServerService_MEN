import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketSubmissionDialogComponent } from './ticket-submission-dialog.component';

describe('TicketSubmissionDialogComponent', () => {
  let component: TicketSubmissionDialogComponent;
  let fixture: ComponentFixture<TicketSubmissionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketSubmissionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketSubmissionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
