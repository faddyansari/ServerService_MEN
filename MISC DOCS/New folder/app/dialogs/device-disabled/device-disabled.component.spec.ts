import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceDisabledComponent } from './device-disabled.component';

describe('DeviceDisabledComponent', () => {
  let component: DeviceDisabledComponent;
  let fixture: ComponentFixture<DeviceDisabledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceDisabledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceDisabledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
