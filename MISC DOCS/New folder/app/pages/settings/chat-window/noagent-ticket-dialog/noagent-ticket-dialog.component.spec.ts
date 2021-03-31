import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoagentTicketDialogComponent } from './noagent-ticket-dialog.component';

describe('NoagentTicketDialogComponent', () => {
  let component: NoagentTicketDialogComponent;
  let fixture: ComponentFixture<NoagentTicketDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoagentTicketDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoagentTicketDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
