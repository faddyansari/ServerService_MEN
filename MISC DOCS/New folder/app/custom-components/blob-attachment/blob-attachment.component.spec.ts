import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlobAttachmentComponent } from './blob-attachment.component';

describe('BlobAttachmentComponent', () => {
  let component: BlobAttachmentComponent;
  let fixture: ComponentFixture<BlobAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlobAttachmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlobAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
