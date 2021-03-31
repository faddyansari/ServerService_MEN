import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsInvitesComponent } from './analytics-invites.component';

describe('AnalyticsInvitesComponent', () => {
  let component: AnalyticsInvitesComponent;
  let fixture: ComponentFixture<AnalyticsInvitesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsInvitesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsInvitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
