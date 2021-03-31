import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DpEntityComponent } from './dp-entity.component';

describe('DpEntityComponent', () => {
  let component: DpEntityComponent;
  let fixture: ComponentFixture<DpEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DpEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DpEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
