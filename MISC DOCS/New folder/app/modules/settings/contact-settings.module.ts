import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ContactPermissionsComponent } from '../../pages/settings/contact-settings/contact-permissions/contact-permissions.component';

const routes: Routes = [
    {path:'', redirectTo:'permissions'},
    {path:'permissions', component: ContactPermissionsComponent}
];

@NgModule({
    imports:[
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes)
    ],
    exports:[RouterModule],
    declarations:[
        ContactPermissionsComponent
    ]
})
export class ContactSettingsModule {}