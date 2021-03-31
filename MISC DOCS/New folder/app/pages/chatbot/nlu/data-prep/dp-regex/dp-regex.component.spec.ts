import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DpRegexComponent } from './dp-regex.component';

describe('DpRegexComponent', () => {
  let component: DpRegexComponent;
  let fixture: ComponentFixture<DpRegexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DpRegexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DpRegexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
