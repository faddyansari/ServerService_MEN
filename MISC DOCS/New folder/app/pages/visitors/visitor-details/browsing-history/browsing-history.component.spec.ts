import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowsingHistoryComponent } from './browsing-history.component';

describe('BrowsingHistoryComponent', () => {
  let component: BrowsingHistoryComponent;
  let fixture: ComponentFixture<BrowsingHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowsingHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowsingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
