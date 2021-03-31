import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { WmNewsComponent } from '../../pages/settings/widget-marketing/wm-news/wm-news.component';
import { WmPromotionsComponent } from '../../pages/settings/widget-marketing/wm-promotions/wm-promotions.component';
import { WmFaqsComponent } from '../../pages/settings/widget-marketing/wm-faqs/wm-faqs.component';
import { WidgetMarketingComponent } from '../../pages/settings/widget-marketing/widget-marketing.component';
import { NgxSummernoteModule } from 'ngx-summernote';



const routes: Routes = [
    {path: '', redirectTo: 'news'},
    {path: 'news', component: WmNewsComponent},
    {path: 'promotions', component: WmPromotionsComponent},
    {path: 'faqs', component: WmFaqsComponent}
];

@NgModule({
    imports:[
        CommonModule,
        SharedModule,
        NgxSummernoteModule,
        RouterModule.forChild(routes)
    ],
    exports:[RouterModule],
    declarations:[
        WmNewsComponent,
        WmPromotionsComponent,
        WmFaqsComponent,
    ]
})
export class WidgetMarketingModule {}