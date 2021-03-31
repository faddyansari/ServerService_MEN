import { Component, OnInit, Inject, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';



@Component({
  selector: 'app-transfer-chat-dialog',
  templateUrl: './transfer-chat-dialog.component.html',
  styleUrls: ['./transfer-chat-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TransferChatDialog implements OnInit, AfterViewInit {

  selectedAgent = {
    nickname: 'ZZZZZZZZ',
    id: 'dummy'
  }
  show = true;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    //console.log('IN Transfer Chat Dialog');
    //console.log(data);
    if(data.length > 0){
      if(data[0] == undefined) this.show = false;
    }

  }

  ngAfterViewInit() {
 
   
  }

  ngOnInit() {
  }

  SelectedAgent(agentID: string) {
   
    this.data.map(agent => {
      if (agent.id == agentID) {
        this.selectedAgent = agent;
      }
    });
  }
}




