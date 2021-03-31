import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesetDetailsComponent } from './ruleset-details.component';

describe('RulesetDetailsComponent', () => {
  let component: RulesetDetailsComponent;
  let fixture: ComponentFixture<RulesetDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RulesetDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RulesetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
