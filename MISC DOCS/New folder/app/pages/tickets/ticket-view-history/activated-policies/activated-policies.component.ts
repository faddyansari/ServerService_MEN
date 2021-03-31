import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-activated-policies',
  templateUrl: './activated-policies.component.html',
  styleUrls: ['./activated-policies.component.css']
})
export class ActivatedPoliciesComponent implements OnInit {
  @Input('allActivatedPolicies') allActivatedPolicies = [];
  @Input('priority') priority = '';
  time = '';
  constructor() { 
  }

  ngOnInit() {
  }

  ShowTime(){
    let time='';
    this.allActivatedPolicies.map(single=>{
      single.policyTarget.map(res=>{
        if(res.priority == this.priority){
          time = res.TimeKey + ' ' + res.TimeVal;
        }
      })
    })
    return time;
  }
}
