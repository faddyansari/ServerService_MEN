import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketTasksComponent } from './ticket-tasks.component';

describe('TicketTasksComponent', () => {
  let component: TicketTasksComponent;
  let fixture: ComponentFixture<TicketTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
