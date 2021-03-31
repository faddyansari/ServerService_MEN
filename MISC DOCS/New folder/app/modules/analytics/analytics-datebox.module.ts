import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsDateboxComponent } from '../../pages/analytics/analytics-datebox/analytics-datebox.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports:[
        CommonModule,
        SharedModule
    ],
    exports:[
        AnalyticsDateboxComponent
    ],
    declarations:[
        AnalyticsDateboxComponent
    ]
})
export class AnalyticsDateBoxModule {}