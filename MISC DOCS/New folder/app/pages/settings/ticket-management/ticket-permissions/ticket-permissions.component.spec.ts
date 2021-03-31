import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketPermissionsComponent } from './ticket-permissions.component';

describe('TicketPermissionsComponent', () => {
  let component: TicketPermissionsComponent;
  let fixture: ComponentFixture<TicketPermissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketPermissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
