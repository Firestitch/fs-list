import { Directive, HostListener, Input } from '@angular/core';


@Directive({ selector: '[fsListExpandTrigger]' })
export class FsListExpandTriggerDirective {

  @HostListener('click', ['$event'])
  public click(event) {
    event.preventDefault();
    event.stopPropagation();

    this.toggleRowGroup(this.row);
  }

  @Input()
  public row;

  public toggleRowGroup: (row: any) => void;

  constructor(
  ) {

  }
}
