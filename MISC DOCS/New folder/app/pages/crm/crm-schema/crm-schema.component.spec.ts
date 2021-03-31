import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmSchemaComponent } from './crm-schema.component';

describe('CrmSchemaComponent', () => {
  let component: CrmSchemaComponent;
  let fixture: ComponentFixture<CrmSchemaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmSchemaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmSchemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
