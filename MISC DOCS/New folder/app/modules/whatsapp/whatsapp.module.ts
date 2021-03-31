import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { WhatsappComponent } from '../../pages/whatsapp/whatsapp.component';
import { WhatsappListSidebarComponent } from '../../pages/whatsapp/whatsapp-list-sidebar/whatsapp-list-sidebar.component';
import { WhatsappMessagesComponent } from '../../pages/whatsapp/whatsapp-messages/whatsapp-messages.component';
import { WhatsappHistoryComponent } from '../../pages/whatsapp/whatsapp-history/whatsapp-history.component';
import { WhatsappDialogComponent } from '../../dialogs/whatsapp-dialog/whatsapp-dialog.component';
import { AddContactDialogComponent } from '../../dialogs/add-contact-dialog/add-contact-dialog.component';
import { ProgressLoaderComponent } from '../../progress-loader/progress-loader.component';
// import { Ng2TelInputModule } from 'ng2-tel-input';


const routes: Routes = [
	{
		path: '',
		component: WhatsappComponent,
	}
];

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		RouterModule.forChild(routes),
	],
	exports: [
		RouterModule
	],
	declarations: [
		WhatsappComponent,
		WhatsappListSidebarComponent,
		WhatsappMessagesComponent,
		WhatsappHistoryComponent,
		WhatsappDialogComponent,
		ProgressLoaderComponent
	],
	entryComponents: [
		WhatsappDialogComponent
	]
})

export class WhatsappModule { }

