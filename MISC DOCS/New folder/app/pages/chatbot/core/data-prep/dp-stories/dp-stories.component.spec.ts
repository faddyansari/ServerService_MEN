import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DpStoriesComponent } from './dp-stories.component';

describe('DpStoriesComponent', () => {
  let component: DpStoriesComponent;
  let fixture: ComponentFixture<DpStoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DpStoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DpStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
