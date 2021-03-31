import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-preview-form',
  templateUrl: './preview-form.component.html',
  styleUrls: ['./preview-form.component.scss']
})
export class PreviewFormComponent implements OnInit {
  inputFields = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.inputFields = data;
  }

  ngOnInit() {
  }

}

