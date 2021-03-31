import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NluDataPrepComponent } from './data-prep.component';

describe('DataPrepComponent', () => {
  let component: NluDataPrepComponent;
  let fixture: ComponentFixture<NluDataPrepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NluDataPrepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NluDataPrepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
