import { Component, OnInit, Inject } from '@angular/core';
import { TicketsService } from '../../../services/TicketsService';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-add-tag',
  templateUrl: './add-tag.component.html',
  styleUrls: ['./add-tag.component.scss']
})
export class AddTagComponent implements OnInit {
  tagEdit = false;
  tags=[];
  ids=[];
  public subscriptions: Subscription[] = [];

  constructor(private _ticketService:TicketsService,@Inject(MAT_DIALOG_DATA) public data: any,private dialogRef: MatDialogRef<AddTagComponent>,) {
    //console.log(data);

    // this.subscriptions.push(this._ticketService.ThreadList.subscribe(serverAddress => {
		// 	this.Threadlist = serverAddress;
		// }));
   }

  ngOnInit() {
  }
  BulkTagAssign(tags){
    //console.log(tags);
    
    this.ids = this.data[0].map(e => e._id);
    //console.log(this.ids);
    
		// this._ticketService.BulkTagAssignment(this.ids, tags).subscribe(res=>{
    //   if(res.status =="ok"){
    //    // console.log(res);
    //     this._ticketService.RefreshList();

    //     this.dialogRef.close({
    //       status: true,
    //     });
    //   }
    // });
  }
  ngOnDestroy(): void {
		//Called once, before the instance is destroyed.
		//Add 'implements OnDestroy' to the class.
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
  }
  
  transform(){
    
  }
}
