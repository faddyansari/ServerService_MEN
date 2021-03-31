import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketTemplatesListComponent } from './ticket-templates-list.component';

describe('TicketTemplatesListComponent', () => {
  let component: TicketTemplatesListComponent;
  let fixture: ComponentFixture<TicketTemplatesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketTemplatesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketTemplatesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
