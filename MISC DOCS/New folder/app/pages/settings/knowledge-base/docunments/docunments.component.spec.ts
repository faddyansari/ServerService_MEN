import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocunmentsComponent } from './docunments.component';

describe('DocunmentsComponent', () => {
  let component: DocunmentsComponent;
  let fixture: ComponentFixture<DocunmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocunmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocunmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
