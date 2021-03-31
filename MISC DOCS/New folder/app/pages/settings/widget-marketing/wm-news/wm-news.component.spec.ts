import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WmNewsComponent } from './wm-news.component';

describe('WmNewsComponent', () => {
  let component: WmNewsComponent;
  let fixture: ComponentFixture<WmNewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WmNewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WmNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
