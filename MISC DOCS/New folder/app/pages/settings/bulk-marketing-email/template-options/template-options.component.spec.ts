import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateOptionsComponent } from './template-options.component';

describe('TemplateOptionsComponent', () => {
  let component: TemplateOptionsComponent;
  let fixture: ComponentFixture<TemplateOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
