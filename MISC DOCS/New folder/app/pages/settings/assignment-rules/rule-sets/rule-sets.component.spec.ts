import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleSetsComponent } from './rule-sets.component';

describe('RuleSetsComponent', () => {
  let component: RuleSetsComponent;
  let fixture: ComponentFixture<RuleSetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleSetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleSetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
