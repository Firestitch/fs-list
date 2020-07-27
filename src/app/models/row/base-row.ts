import { RowType } from '../../enums/row-type.enum';

export abstract class BaseRow {

  public index: number;

  protected readonly _rowType: RowType;

  private readonly _data: any = {};

  constructor(
    data: any = {},
    rowType = RowType.Simple,
  ) {
    this._data = data;
    this._rowType = rowType;
  }

  public get data() {
    return this._data;
  }

  public get type() {
    return this._rowType;
  }


  public abstract destroy();
}
