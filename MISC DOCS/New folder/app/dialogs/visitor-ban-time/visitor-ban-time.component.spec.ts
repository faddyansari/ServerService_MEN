import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorBanTimeComponent } from './visitor-ban-time.component';

describe('VisitorBanTimeComponent', () => {
  let component: VisitorBanTimeComponent;
  let fixture: ComponentFixture<VisitorBanTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitorBanTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorBanTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
