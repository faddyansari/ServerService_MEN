import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { IntegrationsFacebookComponent } from '../../pages/settings/integrations/integrations-facebook/integrations-facebook.component';
import { IntegrationsService } from '../../../services/LocalServices/IntegrationsService';
import { AdminSettingsService } from '../../../services/adminSettingsService';
import { FacebookModule, FacebookService } from 'ngx-facebook';
import { FacebookRulesComponent } from '../../pages/settings/integrations/integrations-facebook/facebook-rules/facebook-rules.component';

const routes: Routes = [
    {path: '', redirectTo:'facebook'},
    {path: 'facebook', component: IntegrationsFacebookComponent}
];

@NgModule({
    imports:[
        CommonModule,
        FacebookModule,
        SharedModule,
        RouterModule.forChild(routes)
    ],
    exports:[RouterModule],
    declarations:[
        IntegrationsFacebookComponent,
        FacebookRulesComponent
    ],
    providers:[
        IntegrationsService,
        FacebookService
    ]
})
export class IntegerationsModule {}