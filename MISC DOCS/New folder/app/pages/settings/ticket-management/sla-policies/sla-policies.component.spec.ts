import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaPoliciesComponent } from './sla-policies.component';

describe('SlaPoliciesComponent', () => {
  let component: SlaPoliciesComponent;
  let fixture: ComponentFixture<SlaPoliciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlaPoliciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaPoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
