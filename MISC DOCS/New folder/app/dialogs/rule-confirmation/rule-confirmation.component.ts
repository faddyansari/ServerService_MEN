import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';

@Component({
  selector: 'app-rule-confirmation',
  templateUrl: './rule-confirmation.component.html',
  styleUrls: ['./rule-confirmation.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class RuleConfirmationComponent implements OnInit {
  str='also';
  str2 = "with  + data.summary[3] + operator between them"
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private dialogRef: MatDialogRef<RuleConfirmationComponent>,) {
    //console.log(this.data);
    //console.log(this.data.summary[0]);
    
   }

  ngOnInit() {
  }

  Close(){
    this.dialogRef.close({
      status: true
    });
    
  }
}
