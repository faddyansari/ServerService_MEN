import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ContactsComponent } from '../../pages/contacts/contacts.component';
import { ContactListSidebarComponent } from '../../pages/contacts/contact-list-sidebar/contact-list-sidebar.component';
import { ContactsNavComponent } from '../../pages/contacts/contacts-nav/contacts-nav.component';
import { ContactChatComponent } from '../../pages/contacts/contact-chat/contact-chat.component';
import { ConvListSidebarComponent } from '../../pages/contacts/conv-list-sidebar/conv-list-sidebar.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
	{
		path: '',
        component: ContactsComponent
	},
	// { path: 'automated-responses', component: AutomatedResponsesComponent}
];

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		RouterModule.forChild(routes)
    ],
    exports:[RouterModule],
    declarations:[
        ContactsComponent,
        ContactListSidebarComponent,
        ContactsNavComponent,
        ContactChatComponent,
        ConvListSidebarComponent
    ]
})

export class ContactsModule {}

