import { NgModule } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { NgxPopperModule } from 'ngx-popper';
import { PreloaderComponent } from '../../preloader/preloader.component';
import { FilterPipe } from '../../filter.pipe';
import { AttachmentTypePipe } from '../../attachment-type.pipe';
import { MonthPipePipe } from '../../month-pipe.pipe';
import { AgoPipePipe } from '../../ago-pipe.pipe';
import { EmojicheckPipe } from '../../emojicheck.pipe';
import { DayDifferencePipePipe } from '../../day-difference-pipe.pipe';
import { KeysPipe } from '../../keys.pipe';
import { NumberPad } from '../../numberpad.pipe';
import { AutoGrowDirective } from '../../autogrow.directive';
import { TransformColorPipe } from '../../transform-color.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DpDatePickerModule } from 'ng2-date-picker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { EmojiComponent } from '../../emoji/emoji.component';
import { SplitPipe } from '../../split.pipe';
import { SafeUrlPipe } from '../../safeUrl.pipe';
import { FilterAgentPipe } from '../../filter-agent.pipe';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { UrlifyPipe } from '../../urlify.pipe';
import { PaginationPipe } from '../../pagination.pipe';
import { TagInputModule } from 'ngx-chips'
import { DateRangePickerComponent } from '../../custom-components/date-range-picker/date-range-picker.component';
import { RangeSliderComponent } from '../../custom-components/range-slider/range-slider.component';
import { ChipsInputComponent } from '../../custom-components/chips-input/chips-input.component';
import { CustomSelectComponent } from '../../custom-components/custom-select/custom-select.component';
import { DrawerFiltersComponent } from '../../main/drawer-filters/drawer-filters.component';
import { BlobAttachmentComponent } from '../../custom-components/blob-attachment/blob-attachment.component';
import { IconCustomerRegistationComponent } from '../../custom-components/icon-customer-registation/icon-customer-registation.component';


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		HttpModule,
		HttpClientModule,
		HighchartsChartModule,
		ReactiveFormsModule,
		NgxPopperModule.forRoot(),
		MatSnackBarModule,
		MatDialogModule,
		MatAutocompleteModule,
		DpDatePickerModule,
		MatMenuModule,
		MatCheckboxModule,
		NgMultiSelectDropDownModule.forRoot(),
		TagInputModule
	],
	declarations: [
		PreloaderComponent,
		DateRangePickerComponent,
		RangeSliderComponent,
		// AnalyticsDateboxComponent,
		ChipsInputComponent,
		FilterPipe,
		AttachmentTypePipe,
		MonthPipePipe,
		AgoPipePipe,
		EmojicheckPipe,
		DayDifferencePipePipe,
		KeysPipe,
		NumberPad,
		AutoGrowDirective,
		TransformColorPipe,
		EmojiComponent,
		SplitPipe,
		SafeUrlPipe,
		FilterAgentPipe,
		UrlifyPipe,
		PaginationPipe,
		CustomSelectComponent,
		DrawerFiltersComponent,
		BlobAttachmentComponent,
		IconCustomerRegistationComponent,
	],
	exports: [
		FormsModule,
		HttpModule,
		HttpClientModule,
		HighchartsChartModule,
		ReactiveFormsModule,
		NgxPopperModule,
		MatSnackBarModule,
		MatDialogModule,
		MatAutocompleteModule,
		DpDatePickerModule,
		NgMultiSelectDropDownModule,
		TagInputModule,
		PreloaderComponent,
		FilterPipe,
		AttachmentTypePipe,
		MonthPipePipe,
		AgoPipePipe,
		EmojicheckPipe,
		MatMenuModule,
		MatCheckboxModule,
		DayDifferencePipePipe,
		KeysPipe,
		NumberPad,
		AutoGrowDirective,
		TransformColorPipe,
		SplitPipe,
		EmojiComponent,
		SafeUrlPipe,
		FilterAgentPipe,
		UrlifyPipe,
		DateRangePickerComponent,
		RangeSliderComponent,
		ChipsInputComponent,
		CustomSelectComponent,
		DrawerFiltersComponent,
		BlobAttachmentComponent,
		IconCustomerRegistationComponent,
		// AnalyticsDateboxComponent
	]
})
export class SharedModule { }
