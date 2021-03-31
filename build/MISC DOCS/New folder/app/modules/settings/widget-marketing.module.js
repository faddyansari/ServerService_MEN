"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetMarketingModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var shared_module_1 = require("../shared/shared.module");
var wm_news_component_1 = require("../../pages/settings/widget-marketing/wm-news/wm-news.component");
var wm_promotions_component_1 = require("../../pages/settings/widget-marketing/wm-promotions/wm-promotions.component");
var wm_faqs_component_1 = require("../../pages/settings/widget-marketing/wm-faqs/wm-faqs.component");
var ngx_summernote_1 = require("ngx-summernote");
var routes = [
    { path: '', redirectTo: 'news' },
    { path: 'news', component: wm_news_component_1.WmNewsComponent },
    { path: 'promotions', component: wm_promotions_component_1.WmPromotionsComponent },
    { path: 'faqs', component: wm_faqs_component_1.WmFaqsComponent }
];
var WidgetMarketingModule = /** @class */ (function () {
    function WidgetMarketingModule() {
    }
    WidgetMarketingModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                shared_module_1.SharedModule,
                ngx_summernote_1.NgxSummernoteModule,
                router_1.RouterModule.forChild(routes)
            ],
            exports: [router_1.RouterModule],
            declarations: [
                wm_news_component_1.WmNewsComponent,
                wm_promotions_component_1.WmPromotionsComponent,
                wm_faqs_component_1.WmFaqsComponent,
            ]
        })
    ], WidgetMarketingModule);
    return WidgetMarketingModule;
}());
exports.WidgetMarketingModule = WidgetMarketingModule;
//# sourceMappingURL=widget-marketing.module.js.map