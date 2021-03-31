import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleConfirmationComponent } from './rule-confirmation.component';

describe('RuleConfirmationComponent', () => {
  let component: RuleConfirmationComponent;
  let fixture: ComponentFixture<RuleConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
