import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BannedVisitorsComponent } from './banned-visitors.component';

describe('BannedVisitorsComponent', () => {
  let component: BannedVisitorsComponent;
  let fixture: ComponentFixture<BannedVisitorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BannedVisitorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannedVisitorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
