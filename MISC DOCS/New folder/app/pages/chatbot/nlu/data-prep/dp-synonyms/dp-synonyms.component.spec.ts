import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DpSynonymsComponent } from './dp-synonyms.component';

describe('DpSynonymsComponent', () => {
  let component: DpSynonymsComponent;
  let fixture: ComponentFixture<DpSynonymsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DpSynonymsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DpSynonymsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
