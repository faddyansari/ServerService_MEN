import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentFiltersComponent } from './agent-filters.component';

describe('AgentFiltersComponent', () => {
  let component: AgentFiltersComponent;
  let fixture: ComponentFixture<AgentFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
