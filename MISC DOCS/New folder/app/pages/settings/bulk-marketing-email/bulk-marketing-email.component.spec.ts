import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkMarketingEmailComponent } from './bulk-marketing-email.component';

describe('BulkMarketingEmailComponent', () => {
  let component: BulkMarketingEmailComponent;
  let fixture: ComponentFixture<BulkMarketingEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkMarketingEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkMarketingEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
