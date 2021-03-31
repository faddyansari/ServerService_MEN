import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesetsFormComponent } from './rulesets-form.component';

describe('RulesetsFormComponent', () => {
  let component: RulesetsFormComponent;
  let fixture: ComponentFixture<RulesetsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RulesetsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RulesetsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
