import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesetAddNewComponent } from './ruleset-add-new.component';

describe('RulesetAddNewComponent', () => {
  let component: RulesetAddNewComponent;
  let fixture: ComponentFixture<RulesetAddNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RulesetAddNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RulesetAddNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
