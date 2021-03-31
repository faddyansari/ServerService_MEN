import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-big-img',
  templateUrl: './big-img.component.html',
  styleUrls: ['./big-img.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BigImgComponent implements OnInit {
  image: any;
  details: any
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    //console.log(data.fileDetails);

    this.image = data.url;
    this.details = data.fileDetails;
  }

  ngOnInit() {
  }

}
