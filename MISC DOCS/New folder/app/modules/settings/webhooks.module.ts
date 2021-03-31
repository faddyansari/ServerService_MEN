import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { CustomScriptComponent } from '../../pages/settings/web-hooks/custom-script/custom-script.component';
import { ThirdPartySyncComponent } from '../../pages/settings/web-hooks/third-party-sync/third-party-sync.component';
import { WebHooksComponent } from '../../pages/settings/web-hooks/web-hooks.component';
import { WebHookSettingsService } from '../../../services/LocalServices/WebHookSettings';


const routes: Routes = [
    {path: '',  redirectTo: 'script'},
    {path: 'script', component: CustomScriptComponent},
    {path: 'thirdparty', component: ThirdPartySyncComponent}
];

@NgModule({
    imports:[
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes)
    ],
    exports:[RouterModule],
    providers:[
        WebHookSettingsService
    ],
    declarations:[
        CustomScriptComponent,
        ThirdPartySyncComponent
    ]
})
export class WebhooksModule {}