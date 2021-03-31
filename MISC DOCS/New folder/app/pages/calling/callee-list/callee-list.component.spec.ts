import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalleeListComponent } from './callee-list.component';

describe('CalleeListComponent', () => {
  let component: CalleeListComponent;
  let fixture: ComponentFixture<CalleeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalleeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalleeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
