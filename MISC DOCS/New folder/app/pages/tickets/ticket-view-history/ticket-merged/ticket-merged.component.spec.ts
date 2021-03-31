import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketMergedComponent } from './ticket-merged.component';

describe('TicketMergedComponent', () => {
  let component: TicketMergedComponent;
  let fixture: ComponentFixture<TicketMergedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketMergedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketMergedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
