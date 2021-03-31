import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CallPermissionsComponent } from '../../pages/settings/call-settings/call-permissions/call-permissions.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
    {path:'', redirectTo:'permissions'},
    {path:'permissions', component: CallPermissionsComponent}
];

@NgModule({
    imports:[
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes)
    ],
    exports:[RouterModule],
    declarations:[
        CallPermissionsComponent
    ]
})
export class CallSettingsModule {}