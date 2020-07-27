import { BehaviorSubject } from 'rxjs';
import { BaseRow } from './base-row';
import { RowType } from '../../enums/row-type.enum';
import { ChildRow } from './child-row';

export class GroupRow extends BaseRow {

  public children: ChildRow[] = [];

  private readonly _expanded = new BehaviorSubject<boolean>(false);

  constructor(
    data: any = {},
    initialExpand = false,
  ) {
    super(data, RowType.Group);

    if (initialExpand) {
      this._expanded.next(initialExpand);
    }
  }

  public get isGroup(): boolean {
    return true;
  }

  public get expanded() {
    return this._expanded.getValue();
  }

  public get expanded$() {
    return this._expanded.asObservable();
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
