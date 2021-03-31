import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from '../../pages/settings/profile/profile.component';


const routes: Routes = [
    {path: '', component: ProfileComponent}
];

@NgModule({
    imports:[
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes)
    ],
    exports:[RouterModule],
    declarations:[
        ProfileComponent
    ]
})
export class ProfileModule {}