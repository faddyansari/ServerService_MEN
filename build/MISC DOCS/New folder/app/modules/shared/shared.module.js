"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedModule = void 0;
var core_1 = require("@angular/core");
var highcharts_angular_1 = require("highcharts-angular");
var ngx_popper_1 = require("ngx-popper");
var preloader_component_1 = require("../../preloader/preloader.component");
var filter_pipe_1 = require("../../filter.pipe");
var attachment_type_pipe_1 = require("../../attachment-type.pipe");
var month_pipe_pipe_1 = require("../../month-pipe.pipe");
var ago_pipe_pipe_1 = require("../../ago-pipe.pipe");
var emojicheck_pipe_1 = require("../../emojicheck.pipe");
var day_difference_pipe_pipe_1 = require("../../day-difference-pipe.pipe");
var keys_pipe_1 = require("../../keys.pipe");
var numberpad_pipe_1 = require("../../numberpad.pipe");
var autogrow_directive_1 = require("../../autogrow.directive");
var transform_color_pipe_1 = require("../../transform-color.pipe");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var http_2 = require("@angular/common/http");
var snack_bar_1 = require("@angular/material/snack-bar");
var dialog_1 = require("@angular/material/dialog");
var autocomplete_1 = require("@angular/material/autocomplete");
var ng2_date_picker_1 = require("ng2-date-picker");
var ng_multiselect_dropdown_1 = require("ng-multiselect-dropdown");
var emoji_component_1 = require("../../emoji/emoji.component");
var split_pipe_1 = require("../../split.pipe");
var safeUrl_pipe_1 = require("../../safeUrl.pipe");
var filter_agent_pipe_1 = require("../../filter-agent.pipe");
var menu_1 = require("@angular/material/menu");
var checkbox_1 = require("@angular/material/checkbox");
var common_1 = require("@angular/common");
var urlify_pipe_1 = require("../../urlify.pipe");
var pagination_pipe_1 = require("../../pagination.pipe");
var ngx_chips_1 = require("ngx-chips");
var date_range_picker_component_1 = require("../../custom-components/date-range-picker/date-range-picker.component");
var range_slider_component_1 = require("../../custom-components/range-slider/range-slider.component");
var chips_input_component_1 = require("../../custom-components/chips-input/chips-input.component");
var custom_select_component_1 = require("../../custom-components/custom-select/custom-select.component");
var drawer_filters_component_1 = require("../../main/drawer-filters/drawer-filters.component");
var blob_attachment_component_1 = require("../../custom-components/blob-attachment/blob-attachment.component");
var icon_customer_registation_component_1 = require("../../custom-components/icon-customer-registation/icon-customer-registation.component");
var SharedModule = /** @class */ (function () {
    function SharedModule() {
    }
    SharedModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                http_1.HttpModule,
                http_2.HttpClientModule,
                highcharts_angular_1.HighchartsChartModule,
                forms_1.ReactiveFormsModule,
                ngx_popper_1.NgxPopperModule.forRoot(),
                snack_bar_1.MatSnackBarModule,
                dialog_1.MatDialogModule,
                autocomplete_1.MatAutocompleteModule,
                ng2_date_picker_1.DpDatePickerModule,
                menu_1.MatMenuModule,
                checkbox_1.MatCheckboxModule,
                ng_multiselect_dropdown_1.NgMultiSelectDropDownModule.forRoot(),
                ngx_chips_1.TagInputModule
            ],
            declarations: [
                preloader_component_1.PreloaderComponent,
                date_range_picker_component_1.DateRangePickerComponent,
                range_slider_component_1.RangeSliderComponent,
                // AnalyticsDateboxComponent,
                chips_input_component_1.ChipsInputComponent,
                filter_pipe_1.FilterPipe,
                attachment_type_pipe_1.AttachmentTypePipe,
                month_pipe_pipe_1.MonthPipePipe,
                ago_pipe_pipe_1.AgoPipePipe,
                emojicheck_pipe_1.EmojicheckPipe,
                day_difference_pipe_pipe_1.DayDifferencePipePipe,
                keys_pipe_1.KeysPipe,
                numberpad_pipe_1.NumberPad,
                autogrow_directive_1.AutoGrowDirective,
                transform_color_pipe_1.TransformColorPipe,
                emoji_component_1.EmojiComponent,
                split_pipe_1.SplitPipe,
                safeUrl_pipe_1.SafeUrlPipe,
                filter_agent_pipe_1.FilterAgentPipe,
                urlify_pipe_1.UrlifyPipe,
                pagination_pipe_1.PaginationPipe,
                custom_select_component_1.CustomSelectComponent,
                drawer_filters_component_1.DrawerFiltersComponent,
                blob_attachment_component_1.BlobAttachmentComponent,
                icon_customer_registation_component_1.IconCustomerRegistationComponent,
            ],
            exports: [
                forms_1.FormsModule,
                http_1.HttpModule,
                http_2.HttpClientModule,
                highcharts_angular_1.HighchartsChartModule,
                forms_1.ReactiveFormsModule,
                ngx_popper_1.NgxPopperModule,
                snack_bar_1.MatSnackBarModule,
                dialog_1.MatDialogModule,
                autocomplete_1.MatAutocompleteModule,
                ng2_date_picker_1.DpDatePickerModule,
                ng_multiselect_dropdown_1.NgMultiSelectDropDownModule,
                ngx_chips_1.TagInputModule,
                preloader_component_1.PreloaderComponent,
                filter_pipe_1.FilterPipe,
                attachment_type_pipe_1.AttachmentTypePipe,
                month_pipe_pipe_1.MonthPipePipe,
                ago_pipe_pipe_1.AgoPipePipe,
                emojicheck_pipe_1.EmojicheckPipe,
                menu_1.MatMenuModule,
                checkbox_1.MatCheckboxModule,
                day_difference_pipe_pipe_1.DayDifferencePipePipe,
                keys_pipe_1.KeysPipe,
                numberpad_pipe_1.NumberPad,
                autogrow_directive_1.AutoGrowDirective,
                transform_color_pipe_1.TransformColorPipe,
                split_pipe_1.SplitPipe,
                emoji_component_1.EmojiComponent,
                safeUrl_pipe_1.SafeUrlPipe,
                filter_agent_pipe_1.FilterAgentPipe,
                urlify_pipe_1.UrlifyPipe,
                date_range_picker_component_1.DateRangePickerComponent,
                range_slider_component_1.RangeSliderComponent,
                chips_input_component_1.ChipsInputComponent,
                custom_select_component_1.CustomSelectComponent,
                drawer_filters_component_1.DrawerFiltersComponent,
                blob_attachment_component_1.BlobAttachmentComponent,
                icon_customer_registation_component_1.IconCustomerRegistationComponent,
            ]
        })
    ], SharedModule);
    return SharedModule;
}());
exports.SharedModule = SharedModule;
//# sourceMappingURL=shared.module.js.map