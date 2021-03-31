import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { GroupManagementComponent } from '../../pages/settings/group-management/group-management.component';


const routes: Routes = [
    {path: '', component: GroupManagementComponent}
];

@NgModule({
    imports:[
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes)
    ],
    exports:[RouterModule],
    declarations:[
        GroupManagementComponent
    ]
})
export class GroupManagementModule {}