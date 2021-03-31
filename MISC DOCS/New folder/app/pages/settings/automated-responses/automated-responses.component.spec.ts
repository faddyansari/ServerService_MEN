import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomatedResponsesComponent } from './automated-responses.component';

describe('AutomatedResponsesComponent', () => {
  let component: AutomatedResponsesComponent;
  let fixture: ComponentFixture<AutomatedResponsesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutomatedResponsesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomatedResponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
