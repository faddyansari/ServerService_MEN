import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
    selector: 'app-toast-notifications',
    templateUrl: './toast-notifications.component.html',
    styleUrls: ['./toast-notifications.component.scss'],
    encapsulation: ViewEncapsulation.None
})


export class ToastNotifications {

    icon: string = '';
    msg: string = '';
    img: string = '';
    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
        this.icon = data.icon;
        this.msg = data.msg;
        if(data.img) this.img = data.img;
        
    }

}