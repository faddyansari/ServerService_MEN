import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DpActionsComponent } from './dp-actions.component';

describe('DpActionsComponent', () => {
  let component: DpActionsComponent;
  let fixture: ComponentFixture<DpActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DpActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DpActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
