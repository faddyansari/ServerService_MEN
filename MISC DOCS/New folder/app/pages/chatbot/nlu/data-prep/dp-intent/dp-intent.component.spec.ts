import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DpIntentComponent } from './dp-intent.component';

describe('DpIntentComponent', () => {
  let component: DpIntentComponent;
  let fixture: ComponentFixture<DpIntentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DpIntentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DpIntentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
