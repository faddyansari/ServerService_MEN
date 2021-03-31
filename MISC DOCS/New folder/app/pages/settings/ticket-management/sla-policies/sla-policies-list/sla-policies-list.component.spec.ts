import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaPoliciesListComponent } from './sla-policies-list.component';

describe('SlaPoliciesListComponent', () => {
  let component: SlaPoliciesListComponent;
  let fixture: ComponentFixture<SlaPoliciesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlaPoliciesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaPoliciesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
