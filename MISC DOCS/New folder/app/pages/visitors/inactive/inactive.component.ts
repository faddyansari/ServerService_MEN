import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
    selector: 'app-inactive',
    templateUrl: './inactive.component.html',
    styleUrls: ['./inactive.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InactiveComponent implements OnInit {

    //INPUT
    _visitorList: BehaviorSubject<any> = new BehaviorSubject([]);
    private _selectedVisitor: BehaviorSubject<any> = new BehaviorSubject(undefined);


    @Input('searchValue') searchValue: boolean;
    @Input('loading') loading: boolean = true;
    @Input('action') action: string = "inviteChat";
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
    @Output('ManualAssignmentVisitorId') ManualAssignmentVisitorId = new EventEmitter();

    constructor(private changeDetectorRef: ChangeDetectorRef) {
        this.changeDetectorRef.detach()
    }

    ngOnInit() {

        if (this.action && this.action == "inviteChat") {
            this.ManualQueueAssignment(this._selectedVisitor.getValue().id);
        }
    }

    ManualQueueAssignment(visitorid: string) {
        this.ManualAssignmentVisitorId.emit(visitorid);
    }

    // inactiveVisitors(visitorList) {
    //     return visitorList.filter(visitor => {
    //         if (visitor.inactive) return visitor
    //     });
    // }

    SelectVisitor(visitorId: string) {
        this.SelectedVisitorId.emit(visitorId);
    }

    // identifyChange(index,item){
    //     // console.log('Track By Change Inactive : ', item)
    //     return item._id;
    // }
}