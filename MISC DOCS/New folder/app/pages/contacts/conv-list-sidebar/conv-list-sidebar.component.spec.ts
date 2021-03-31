import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvListSidebarComponent } from './conv-list-sidebar.component';

describe('ConvListSidebarComponent', () => {
  let component: ConvListSidebarComponent;
  let fixture: ComponentFixture<ConvListSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvListSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvListSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
