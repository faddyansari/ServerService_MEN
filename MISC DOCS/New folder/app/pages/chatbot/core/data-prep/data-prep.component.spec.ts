import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreDataPrepComponent } from './data-prep.component';

describe('DataPrepComponent', () => {
  let component: CoreDataPrepComponent;
  let fixture: ComponentFixture<CoreDataPrepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoreDataPrepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreDataPrepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
