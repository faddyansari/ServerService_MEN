import { Component, OnInit, ViewEncapsulation, Input, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
    selector: 'app-browsing',
    templateUrl: './browsing.component.html',
    styleUrls: ['./browsing.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrowsingComponent implements OnInit {
    //INPUT
    _visitorList: BehaviorSubject<any> = new BehaviorSubject([]);
    private _selectedVisitor: BehaviorSubject<any> = new BehaviorSubject(undefined);

    @Input('searchValue') searchValue: boolean;
    @Input('aEng') aEng: boolean = false;
    @Input('loading') loading: boolean = true;
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
    @Input('action') action: string = "initiateChat";
    @Input('performingAction') performingAction: any = {};
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
    @Output('InitiateChatVisitorId') InitiateChatVisitorId = new EventEmitter();

    constructor(private changeDetectorRef: ChangeDetectorRef) {
        this.changeDetectorRef.detach();
    }

    ngOnInit() {

        if (this.action && this.action == "initiateChat") {
            this.InitiateChat(this._selectedVisitor.getValue().id);
            this._visitorList.getValue().length;
        }

    }

    ngAfterViewInit(): void {
        //Called after every check of the component's view. Applies to components only.
        //Add 'implements AfterViewChecked' to the class.
        this.changeDetectorRef.detectChanges();
    }

    InitiateChat(visitorid: string) {
        this.InitiateChatVisitorId.emit(visitorid);
    }

    // browsingVisitors(visitorList) {
    //     return this._visitorList.getValue().filter(visitor => {
    //         if ((visitor.state == 1 || visitor.state == 8) && !visitor.inactive) return visitor
    //     });
    // }

    SelectVisitor(visitorId: string) {
        // console.log('Set Selected Visitor Browser Component');
        this.SelectedVisitorId.emit(visitorId);
    }

    // identifyChange(index, item) {
    //     // console.log('Track BY : ', item);
    //     return item._id;
    // }
}