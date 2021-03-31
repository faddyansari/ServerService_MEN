import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesetsListComponent } from './rulesets-list.component';

describe('RulesetsListComponent', () => {
  let component: RulesetsListComponent;
  let fixture: ComponentFixture<RulesetsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RulesetsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RulesetsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
