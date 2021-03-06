import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
    selector: 'app-chatting',
    templateUrl: './chatting.component.html',
    styleUrls: ['./chatting.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChattingComponent implements OnInit {
    //INPUT
    _visitorList: BehaviorSubject<any> = new BehaviorSubject([]);
    private _selectedVisitor: BehaviorSubject<any> = new BehaviorSubject(undefined);

    @Input('searchValue') searchValue: boolean;
    @Input('loading') loading: boolean = true;
    @Input('permissions') permissions: any;
    @Input('agent') agent: any;
    @Input('action') action: string = "transferChat";
    @Input('SuperVisedChatList') SuperVisedChatList: Array<string> = [];
    @Input('performingAction') performingAction: any = {};
    @Input('tick') set tick(value) {
        this._visitorList.next(this._visitorList.getValue().map(visitor => {
            let currentDate = Date.parse(new Date().toISOString()) - Date.parse(new Date(visitor.creationDate).toISOString());
            visitor.seconds = Math.floor((currentDate / 1000) % 60);
            visitor.minutes = Math.floor((currentDate / 1000 / 60) % 60);
            visitor.hours = Math.floor((currentDate / 1000) / 60 / 60);
            return visitor;
        }));
        this.changeDetectorRef.detectChanges();
    }
    @Input('selectedVisitor') set selectedVisitor(value: any) {
        // console.log('Setting Selecting Visitor');
        this._selectedVisitor.next(value);
        this.changeDetectorRef.detectChanges();
    }
    @Input('visitorList') set visitorList(value: Array<any>) {
        // console.log(value);
        // console.log('Got New Visitor List', Date.parse(new Date().toISOString()));
        this._visitorList.next(value);
        this.changeDetectorRef.detectChanges();
    }
    //OUTPUT
    @Output('SelectedVisitorId') SelectedVisitorId = new EventEmitter();
    @Output('TransferChatDetails') TransferChatDetails = new EventEmitter();
    @Output('endSuperVision') endSuperVision = new EventEmitter();
    @Output('SuperviseChat') SuperviseChat = new EventEmitter();

    constructor(private changeDetectorRef: ChangeDetectorRef) {
        this.changeDetectorRef.detach();
    }

    ngOnInit() {
        //console.log(this.performingAction);

        if (this.action && this.action == "initiateChat") {
            this.TransferChat(this._selectedVisitor.getValue().id, this._selectedVisitor.getValue().location);
        }
    }

    EndSuperVision(visitor: any) {
        if (confirm('Are you sure you want to end the Supervision?')) {
            this.endSuperVision.emit({
                cid: visitor.conversationID
            });
        }

    }

    TransferChat(sid: string, location: string) {

        //console.log(this.performingAction);

        this.TransferChatDetails.emit({
            sid: sid,
            location: location
        });
    }

    // chattingVisitors(visitorList) {
    //     return this._visitorList.getValue().filter(visitor => {
    //         if (visitor.state == 3 && !visitor.inactive) return visitor
    //     });
    // }

    SelectVisitor(visitorId: string) {
        this.SelectedVisitorId.emit(visitorId);
    }

    // identifyChange(index, item) {
    //     return item._id;
    // }

    SuperViseChat(event: Event, visitor: any) {
        //this.performingAction
        if (confirm('Are you sure you want to Supervise the Chat')) {
            this.SuperviseChat.emit(visitor);
        }
        // this.SuperviseChat.emit('/chats/' + visitor.conversationID);
    }

    CheckIfChatSuperVised(cid) {
        return this.SuperVisedChatList.includes(cid)
    }

}