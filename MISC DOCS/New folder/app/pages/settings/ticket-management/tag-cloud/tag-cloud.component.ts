import { TagService } from './../../../../../services/TagService';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToastNotifications } from '../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { MatSnackBar } from '@angular/material';
import { PopperContent } from 'ngx-popper';

@Component({
  selector: 'app-tag-cloud',
  templateUrl: './tag-cloud.component.html',
  styleUrls: ['./tag-cloud.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TagCloudComponent implements OnInit {
  @ViewChild('sortPopper') sortPopper: PopperContent

  showForm = false;
  editCase = false;
  index = '';
  tagList = [];
  tagForm: FormGroup;
  subscriptions: Subscription[] = [];
  SortBy = ['Ascending Order', 'Descending Order']
  tagPattern = /^[ \t]*#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z])[ \t]*((,)?#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z]))*$/;
  searchValue = '';
  constructor(private _appStateService: GlobalStateService, private formbuilder: FormBuilder, private _tagService: TagService, private snackBar: MatSnackBar) {
    this._appStateService.contentInfo.next('');
    this._appStateService.breadCrumbTitle.next('Ticket Management');
    this.subscriptions.push(this._tagService.Tags.subscribe(res => {
      if (res && res.length) {
        this.tagList = res;
      }
    }));

  }

  ngOnInit() {
    this.tagForm = this.formbuilder.group({
      'hashTag':
        [
          null,
          [
            Validators.required,
            Validators.pattern(/^[ \t]*#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z])[ \t]*((,)?#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z]))*$/),
            Validators.maxLength(32)
          ],
        ]
    });
  }

  DeleteTag(i) {
    if (this.tagList && this.tagList.length) {
      this.tagList.splice(i, 1);
      this._tagService.deleteTag(this.tagList);
    }
  }

  AddTag() {
    this.tagForm.reset();
    this.editCase = false;
    this.showForm = !this.showForm;
  }

  RemoveDuplicateTags(array) {

    let arr = {};
    array.map(value => { if (value.trim()) arr[value] = value.trim() });
    return Object.keys(arr);

  }

  insertTag() {
    let hashTag = this.tagForm.get('hashTag').value;

    let commaseparatedTags = this.RemoveDuplicateTags((hashTag as string).split(','));

    if ((commaseparatedTags && commaseparatedTags.length == 1) && (this.tagList && this.tagList.filter(data => data == commaseparatedTags[0]).length > 0)) {
      this.snackBar.openFromComponent(ToastNotifications, {
        data: {
          img: 'warning',
          msg: 'Tag already exists!'
        },
        duration: 3000,
        panelClass: ['user-alert', 'error']
      });
      this.showForm = false;
      return;
    }
    else {
      // commaseparatedTags = this.RemoveDuplicateTags(commaseparatedTags);
      if (commaseparatedTags && commaseparatedTags.length) {

        if (this.tagList && !this.tagList.length) this.tagList = [];
        this.tagList = this.tagList.concat(commaseparatedTags);
        // commaseparatedTags.map(single=>{

        //   this.tagList.push({ tag_name: single, count: 0, ticketRef: [] });
        // })
        this._tagService.insertTag(this.tagList)
      }
    }

    this.showForm = false;
  }

  updateTag(tag, i) {
    this.index = i;
    this.editCase = true;
    this.showForm = true;
    this.tagForm.get('hashTag').setValue(tag);

  }
  EditTag() {
    this.tagList[this.index] = this.tagForm.get('hashTag').value;
    this._tagService.UpdateTag(this.tagList);
    this.showForm = false;
    this.editCase = false;
  }

  Sortby(val) {

    this._tagService.sort(val);
    this.sortPopper.hide();
  }
}
