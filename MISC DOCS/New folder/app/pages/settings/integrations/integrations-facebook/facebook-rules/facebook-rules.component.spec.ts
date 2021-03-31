import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookRulesComponent } from './facebook-rules.component';

describe('FacebookRulesComponent', () => {
  let component: FacebookRulesComponent;
  let fixture: ComponentFixture<FacebookRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacebookRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacebookRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
