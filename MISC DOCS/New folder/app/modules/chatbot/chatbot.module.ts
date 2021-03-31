import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { NluComponent } from '../../pages/chatbot/nlu/nlu.component';
import { NluDataPrepComponent } from '../../pages/chatbot/nlu/data-prep/data-prep.component';
import { NluTrainComponent } from '../../pages/chatbot/nlu/train/train.component';
import { CoreComponent } from '../../pages/chatbot/core/core.component';
import { CoreDataPrepComponent } from '../../pages/chatbot/core/data-prep/data-prep.component';
import { CoreTrainComponent } from '../../pages/chatbot/core/train/train.component';
import { ChatbotComponent } from '../../pages/chatbot/chatbot.component';
import { DpSynonymsComponent } from '../../pages/chatbot/nlu/data-prep/dp-synonyms/dp-synonyms.component';
import { DpActionsComponent } from '../../pages/chatbot/core/data-prep/dp-actions/dp-actions.component';
import { DpEntityComponent } from '../../pages/chatbot/nlu/data-prep/dp-entity/dp-entity.component';
import { DpIntentComponent } from '../../pages/chatbot/nlu/data-prep/dp-intent/dp-intent.component';
import { DpRegexComponent } from '../../pages/chatbot/nlu/data-prep/dp-regex/dp-regex.component';
import { DpStoriesComponent } from '../../pages/chatbot/core/data-prep/dp-stories/dp-stories.component';
import { RespFunctionComponent } from '../../pages/chatbot/core/data-prep/resp-function/resp-function.component';

const routes: Routes = [
	{
		path: '',
        component: ChatbotComponent,
        children: [
			{ path: '', redirectTo: 'nlu' },
			{ path: 'nlu', children:[
                { path: '', redirectTo: 'data-prep'},
                { path: 'data-prep', component: NluDataPrepComponent},
                { path: 'train', component: NluTrainComponent},
            ], component : NluComponent},
			{ path: 'core',  children:[
                { path: '', redirectTo: 'data-prep'},
                { path: 'data-prep', component: CoreDataPrepComponent},
                { path: 'train', component: CoreTrainComponent},
            ], component: CoreComponent},
        ],
        
	}
];

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		RouterModule.forChild(routes)
    ],
    exports:[
		RouterModule
	],
    declarations:[
        ChatbotComponent,
        NluComponent,
        NluDataPrepComponent,
        NluTrainComponent,
        CoreComponent,
        CoreDataPrepComponent,
        CoreTrainComponent,
        DpSynonymsComponent,
        DpActionsComponent,
        DpEntityComponent,
        DpIntentComponent,
        DpRegexComponent,
        DpStoriesComponent,
        RespFunctionComponent,
    ]
})

export class ChatbotModule {}

