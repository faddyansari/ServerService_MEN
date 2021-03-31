import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesetsComponent } from './rulesets.component';

describe('RulesetsComponent', () => {
  let component: RulesetsComponent;
  let fixture: ComponentFixture<RulesetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RulesetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RulesetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
