import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketTemplatesComponent } from './ticket-templates.component';

describe('TemplatesComponent', () => {
  let component: TicketTemplatesComponent;
  let fixture: ComponentFixture<TicketTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
