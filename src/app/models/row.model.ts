/*
import { BehaviorSubject } from 'rxjs';
import { RowType } from '../enums/row-type.enum';

export class Row {

  public data: any = {};
  public children: Row[] = [];
  public isGroup = false;
  public isChild = false;

  public index: number;

  private _rowType: RowType;
  private _parent: Row;
  private _expanded = new BehaviorSubject<boolean>(false);

  constructor(
    data: any = {},
    rowType = RowType.Simple,
    parent: Row = null,
    initialExpand = false,
  ) {
    this.data = data;

    this._rowType = rowType;
    this.isGroup = rowType === RowType.Group;
    this.isChild = rowType === RowType.Child;
    this._parent = parent;

    if (initialExpand) {
      this._expanded.next(initialExpand);
    }
  }

  get expanded() {
    return this._expanded.getValue();
  }

  get expanded$() {
    return this._expanded.asObservable();
  }

  get type() {
    return this._rowType;
  }

  get parent() {
    return this._parent;
  }

  public updateChildrenIndexes() {
    this.children.forEach((row, index) => {
      row.index = index;
    })
  }

  public toggleRowExpandStatus() {
    this._expanded.next(!this.expanded);
  }

  public destroy() {
    this.children.forEach((child) => child.destroy());
    this._expanded.complete();
  }
}
*/
