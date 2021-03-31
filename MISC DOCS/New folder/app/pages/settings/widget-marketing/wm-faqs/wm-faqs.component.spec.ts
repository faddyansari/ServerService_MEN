import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WmFaqsComponent } from './wm-faqs.component';

describe('WmFaqsComponent', () => {
  let component: WmFaqsComponent;
  let fixture: ComponentFixture<WmFaqsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WmFaqsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WmFaqsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
