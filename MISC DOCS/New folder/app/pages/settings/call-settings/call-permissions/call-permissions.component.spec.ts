import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallPermissionsComponent } from './call-permissions.component';

describe('CallPermissionsComponent', () => {
  let component: CallPermissionsComponent;
  let fixture: ComponentFixture<CallPermissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallPermissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
