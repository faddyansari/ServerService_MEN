import { Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy, AfterViewInit, Input, ElementRef } from '@angular/core';
import { ChatService } from '../../../../../services/ChatService';
import { Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'app-chat-list-archive',
	templateUrl: './chat-list-archive.component.html',
	styleUrls: ['./chat-list-archive.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ChatListArchiveComponent implements OnInit, OnDestroy, AfterViewInit {

	@Input() searchValue: string;
	@ViewChild('scrollContainer') scrollContainer: ElementRef;
	archivesList: Array<any> = []
	selectedConversation: any;
	subscriptions: Subscription[] = [];
	scrollHeight = 0;
	loadingMoreArchives = false;

	constructor(private _chatService: ChatService) {

		// //console.log('Archives Loaded');
		this.subscriptions.push(_chatService.getLoading('MOREARCHIVES').subscribe(data => {
			this.loadingMoreArchives = data;
		}));

		this.subscriptions.push(_chatService.getArchives().subscribe(archiveList => {

			this.archivesList = archiveList;
		}));


		this.subscriptions.push(_chatService.getCurrentConversation().subscribe(conversation => {
			this.selectedConversation = conversation;
			if (Object.keys(this.selectedConversation).length && !this.selectedConversation.synced) {
				this._chatService.getArchiveMessages(this.selectedConversation._id);
			}
		}));

	}

	ngOnInit() {
	}

	ngOnDestroy(): void {
		//Called once, before the instance is destroyed.
		//Add 'implements OnDestroy' to the class.
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
	}

	ngAfterViewInit() {
		//Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
		//Add 'implements AfterViewInit' to the class.
		this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
		//console.log(this.scrollHeight)
		// this.scrollRef.scrollState
		//   .debounceTime(100)
		//   .subscribe(data => {
		//     if (Math.round(data.target.scrollTop + data.target.clientHeight) >= (this.scrollRef.view.scrollHeight - 10)) {
		//       this._chatService.getMoreArchivesFromBackend();
		//     }
		//     this.scrollHeight = this.scrollRef.view.scrollHeight;
		//   })
	}

	ScrollChanged(event: UIEvent) {	
		if (Math.round((event.target as HTMLElement).scrollTop + (event.target as HTMLElement).clientHeight) >= (this.scrollContainer.nativeElement.scrollHeight - 10)) {
			this._chatService.getMoreArchivesFromBackend();
		}
		this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
	}

	ngAfterViewChecked() {
		//Called after every check of the component's view. Applies to components only.
		//Add 'implements AfterViewChecked' to the class.
		if (this.loadingMoreArchives) {
			this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight + 20;
			// this.scrollRef.scrollYTo(this.scrollRef.view.scrollHeight + 20);
		}
	}

	CheckAttachmentType(data) {
		return (typeof data === 'string');
	}

	// FetchFilterd(){
	// 	this._chatService.Filters.next(this.ApplyFilter());
	// 	this._chatService.getArchivesFromBackend();
	// }

	// ApplyFilter() {
	// 	let filters = {
	// 		tag: [],
	// 		agent: [],
	// 		daterange: {},
	// 	}
	// 	let matchObject: any = {};
	// 	Object.keys(filters).map(key => {
	// 		//console.log(key + ' ' + JSON.stringify(filters[key]));
	// 		if (filters[key]) {
	// 			if (Array.isArray(filters[key]) && filters[key].length) {
	// 				Object.assign(matchObject, { [key]: filters[key] });
	// 			} else if (!Array.isArray(filters[key]) && Object.keys(filters[key]).length) {
	// 				Object.assign(matchObject, { [key]: filters[key] });
	// 			}
	// 		}
	// 	});
	// 	//console.log(JSON.parse(JSON.stringify(matchObject)));
	// 	return { filter: matchObject}
	// }

}
