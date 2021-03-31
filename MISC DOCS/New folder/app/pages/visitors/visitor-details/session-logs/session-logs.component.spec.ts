import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionLogsComponent } from './session-logs.component';

describe('SessionLogsComponent', () => {
  let component: SessionLogsComponent;
  let fixture: ComponentFixture<SessionLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
