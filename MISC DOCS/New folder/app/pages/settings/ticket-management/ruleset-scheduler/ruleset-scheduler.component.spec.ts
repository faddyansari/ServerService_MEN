import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesetSchedulerComponent } from './ruleset-scheduler.component';

describe('RulesetSchedulerComponent', () => {
  let component: RulesetSchedulerComponent;
  let fixture: ComponentFixture<RulesetSchedulerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RulesetSchedulerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RulesetSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
