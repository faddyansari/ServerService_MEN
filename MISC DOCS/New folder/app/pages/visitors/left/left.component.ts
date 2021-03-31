import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
    selector: 'app-left',
    templateUrl: './left.component.html',
    styleUrls: ['./left.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeftComponent implements OnInit {

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
    @Input('LeftvisitorList') set LeftvisitorList(value: Array<any>) {
        // console.log(value);
        // console.log('Got New Visitor List', Date.parse(new Date().toISOString()));
        this._visitorList.next(value);
        this.changeDetectorRef.detectChanges();
    }
    //OUTPUT
    @Output('SelectedVisitorIdLeft') SelectedVisitorIdLeft = new EventEmitter();
    constructor(private changeDetectorRef: ChangeDetectorRef) {
        this.changeDetectorRef.detach()
    }

    ngOnInit() {
       

    }

    // leftVisitors(visitorList) {
    //     return visitorList;
    // }

    SelectVisitor(visitorId: string) {
        this.SelectedVisitorIdLeft.emit(visitorId);
    }

    identifyChange(index, item) {
        return item._id;
    }
}