import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoforwardingComponent } from './autoforwarding.component';

describe('AutoforwardingComponent', () => {
  let component: AutoforwardingComponent;
  let fixture: ComponentFixture<AutoforwardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoforwardingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoforwardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
