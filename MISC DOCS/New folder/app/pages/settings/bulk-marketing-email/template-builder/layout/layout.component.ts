import { Component, OnInit, Input, ViewEncapsulation, ViewChild, ElementRef, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ConfirmationDialogComponent } from '../../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmailTemplateService } from '../../../../../../services/LocalServices/EmailTemplateService';
import { Subscription } from 'rxjs/Subscription';
import { ToastNotifications } from '../../../../../dialogs/SnackBar-Dialog/toast-notifications.component';

@Component({
	selector: 'app-layout',
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.scss'],
	// changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class LayoutComponent implements OnInit {
  @Input() elementsList: any;
  @Input() editClosed: boolean = false;
  @Input() isDragged: boolean = false;
  activeId = ''
  @Output() sendingChange: EventEmitter<any> = new EventEmitter();
  @Output() deleteChange: EventEmitter<any> = new EventEmitter();
  @Output() cloneElement: EventEmitter<any> = new EventEmitter();
  @Output() draggedElement: EventEmitter<any> = new EventEmitter();
  links =
    {
      'Facebook': '/assets/img/icons/icons-sprite.svg#facebook',
      'Twitter': '/assets/img/icons/icons-sprite.svg#twitter',
      'LinkedIn': '/assets/img/icons/icons-sprite.svg#linkedin',
      'Youtube': '/assets/img/icons/icons-sprite.svg#youtube',
      'Instagram': '/assets/img/icons/icons-sprite.svg#instagram',
    };
  showPanel = false;
  subscriptions: Subscription[] = [];
  constructor(private dialog: MatDialog, private _emailTemplateService: EmailTemplateService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
  }


  ngAfterViewInit() {
  }


  DeleteElement(event, id) {
    let el = document.getElementById(id);
    this.dialog.open(ConfirmationDialogComponent, {
      panelClass: ['confirmation-dialog'],
      data: { headermsg: "Are you sure want to delete this element?" }
    }).afterClosed().subscribe(data => {
      if (data == 'ok') {
        if ((el.parentNode as HTMLElement).tagName.toLowerCase() == 'td') {
          this.elementsList.map(search => {
            search.childs.map(sectionSearch => {
              if (sectionSearch.id == (el.parentNode as HTMLElement).id) {
                sectionSearch.sectionChilds.map((x, ind) => {
                  if (x.id == id) {
                    sectionSearch.sectionChilds.splice(ind, 1);
                  }
                });
              }
            });
          });
        }
        else {
          this.elementsList.map((val, ind) => {
            if (val['id'] == id) {
              this.elementsList.splice(ind, 1);
              this.deleteChange.emit({ showPanel: false });
            }
          });
        }
        this.deleteChange.emit({ showPanel: false });
      }
      else return;
    });
  }
  EditElement(event, id) {
    this.activeId = id;
    this.showPanel = true;
    this.sendingChange.emit({ showPanel: this.showPanel, id: id, event: event });
    // this.showPanel = false;
  }
  CloneElement(event, element, td?) {
    this.cloneElement.emit({ element: element, event: event, td: td });
  }

  ReturnImg(linkType) {
    let key = Object.keys(this.links).filter(part => part == linkType);
    return this.links[linkType];
  }

  // dragStart(ev) {
  //   console.log(ev);
  //   ev.dataTransfer.effectAllowed = "move";
  //   this.draggedElement.emit(ev);
  //   // let index = this.elementsList.findIndex(x => x.id == ev.target.id);
  //   // console.log(index);
  //   // [this.elementsList[index], this.elementsList[index + 1]] = [this.elementsList[index + 1], this.elementsList[index]];
  // }
  // DragLeave(event) {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   event.stopImmediatePropagation();
  //   event.dataTransfer.dropEffect = "move";
  //   this.isDragged = false;
  //   //console.log('Drag End');
  // }
  // allowDrop(event) {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   event.stopImmediatePropagation();
  //   event.dataTransfer.dropEffect = "move";
  //   this.isDragged = true;
  // }
  reOrderUp(index, elt?) {
    console.log("ele", elt);

    if (index == 0) {
      this.snackBar.openFromComponent(ToastNotifications, {
        data: {
          img: 'warning',
          msg: 'No element to swap up!'
        },
        duration: 2000,
        panelClass: ['user-alert', 'warning']
      });
      return;
    }
    else {
      if (elt.includes('Insection')) {
        this.elementsList.map(search => {
          search.childs.forEach(sectionSearch => {
            if (sectionSearch.sectionChilds && sectionSearch.sectionChilds.length) {
              for (let i = 0; i <= sectionSearch.sectionChilds.length - 1; i++) {
                if (sectionSearch.sectionChilds[i].id == elt.id) {
                  sectionSearch.sectionChilds = this.reOrderFunc(index, sectionSearch.sectionChilds, 'up');

                  break;
                }
              }
            }
          });
        });
      }
      else {
        [this.elementsList[index], this.elementsList[index - 1]] = [this.elementsList[index - 1], this.elementsList[index]];
      }
    }
  }
  reOrderDown(index) {
    if (index === this.elementsList.length - 1) {
      this.snackBar.openFromComponent(ToastNotifications, {
        data: {
          img: 'warning',
          msg: 'No element to swap down!'
        },
        duration: 2000,
        panelClass: ['user-alert', 'warning']
      });
      return;
    }
    else {

      [this.elementsList[index], this.elementsList[index + 1]] = [this.elementsList[index + 1], this.elementsList[index]];
    }
  }
  reOrderDownSec(index, elt) {
    this.elementsList.map(search => {
      search.childs.forEach(sectionSearch => {
        if (sectionSearch.sectionChilds && sectionSearch.sectionChilds.length) {
          if (index === sectionSearch.sectionChilds.length - 1) {
            this.snackBar.openFromComponent(ToastNotifications, {
              data: {
                img: 'warning',
                msg: 'No element to swap down!'
              },
              duration: 2000,
              panelClass: ['user-alert', 'warning']
            });
            return;
          }
          else {
            for (let i = 0; i <= sectionSearch.sectionChilds.length - 1; i++) {
              if (sectionSearch.sectionChilds[i].id == elt.id) {
                sectionSearch.sectionChilds = this.reOrderFunc(index, sectionSearch.sectionChilds, 'down');
                break;
              }
            }
          }
        }
        else return;
      });
    });
  }
  reOrderFunc(index, elements, type) {
    switch (type) {
      case 'up':
        [elements[index], elements[index - 1]] = [elements[index - 1], elements[index]];
        break;
      case 'down':
        [elements[index], elements[index + 1]] = [elements[index + 1], elements[index]];
        break;
    }
    return elements;
  }

  // reOrderRight(index) {
  //   this.elementsList.map(search => {
  //     [search.childs[index], search.childs[index + 1]] = [search.childs[index + 1], search.childs[index]];
  //     search.childs.forEach(sectionSearch => {
  //       if (sectionSearch && sectionSearch.sectionChilds && sectionSearch.sectionChilds.length) {
  //         [sectionSearch.sectionChilds[index], sectionSearch.sectionChilds[index + 1]] = [sectionSearch.sectionChilds[index + 1], sectionSearch.sectionChilds[index]];
  //       }
  //       else {
  //         sectionSearch.sectionChilds = [];
  //       }
  //     });
  //   });
  // }
  // reOrderLeft(index) {
  //   this.elementsList.map(search => {
  //     [search.childs[index], search.childs[index - 1]] = [search.childs[index - 1], search.childs[index]];
  //     search.childs.forEach(sectionSearch => {
  //       if (sectionSearch && sectionSearch.sectionChilds && sectionSearch.sectionChilds.length) {
  //         [sectionSearch.sectionChilds[index], sectionSearch.sectionChilds[index - 1]] = [sectionSearch.sectionChilds[index - 1], sectionSearch.sectionChilds[index]];
  //       }
  //       else {
  //         sectionSearch.sectionChilds = [];
  //       }
  //     });
  //   });
  // }

}





















