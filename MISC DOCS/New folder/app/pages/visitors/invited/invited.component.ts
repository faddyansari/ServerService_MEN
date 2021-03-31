import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
    selector: 'app-invited',
    templateUrl: './invited.component.html',
    styleUrls: ['./invited.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class InvitedComponent implements OnInit {

    //INPUT
    _visitorList: BehaviorSubject<any> = new BehaviorSubject([]);
    private _selectedVisitor: BehaviorSubject<any> = new BehaviorSubject(undefined);

    @Input('searchValue') searchValue: boolean;
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
    @Input('selectedVisitor') set selectedVisitor(value: any) {
        // console.log('Setting Selecting Visitor');
        this._selectedVisitor.next(value);
        this.changeDetectorRef.detectChanges();
    }

    @Input('visitorList') set visitorList(value: Array<any>) {
        // console.log(value.length);
        console.log('Got New Visitor List Invited : ', value.length);
        this._visitorList.next(value);
        this.changeDetectorRef.detectChanges();
    }
    //OUTPUT
    @Output('SelectedVisitorId') SelectedVisitorId = new EventEmitter();

    constructor(private changeDetectorRef: ChangeDetectorRef) {
        this.changeDetectorRef.detach()
    }

    ngOnInit() {

    }

    // invitedVisitors(visitorList) {
    //     return visitorList.filter(visitor => {
    //         if (((visitor.state == 4) || (visitor.state == 5)) && !visitor.inactive) return visitor
    //     });
    // }

    SelectVisitor(visitorId: string) {
        this.SelectedVisitorId.emit(visitorId);
    }

    identifyChange(index, item) {
        return item._id;
    }
}