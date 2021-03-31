import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaExportComponent } from './sla-export.component';

describe('SlaExportComponent', () => {
  let component: SlaExportComponent;
  let fixture: ComponentFixture<SlaExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlaExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
