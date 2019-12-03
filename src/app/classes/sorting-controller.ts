import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Column, SortingDirection } from '../models/column.model';
import { List } from './list-controller';
import { FsListSortConfig } from '../interfaces';

export interface SortingChangeEvent {
  sortBy: string;
  sortDirection: string;
}

export class SortingController {
  public config: List;

  public sortingColumns: Column[] = [];
  public fakeSortingColumns: Column[] = [];
  public sortingColumn: Column;

  private _initialization = false;
  private _sortingChanged = new Subject<SortingChangeEvent>();
  private _onDestroy = new Subject();

  constructor() {}

  get sortingChanged(): Observable<SortingChangeEvent> {
    return this._sortingChanged.pipe(takeUntil(this._onDestroy));
  }

  public addSortableColumn(column: Column) {
    this.sortingColumns.push(column);
  }

  /**
   * Set Sortable Direction
   * @param direction
   */
  public sortDirection(direction) {
    if (this.sortingColumn && this.sortingColumn.sortingDirection !== direction) {
      this._setSortingDirection(direction);

      this._notifySortChanged();
    }
  }

  /**
   * Sort By
   * @param column
   */
  public sortBy(column: Column) {
    if (column.sortable) {
      this._setSortingColumn(column);

      this._notifySortChanged();
    }
  }

  /**
   * Same as sortBy, but need only column name as parameter for sort
   * @param name
   */
  public sortByColumnWithName(name: string) {
    const column =
      this.sortingColumns.find(col => col.name === name && col.sortable) ||
      this.fakeSortingColumns.find(col => col.name === name && col.sortable);

    if (!column) { return; }

    this._setSortingColumn(column);
  }

  /**
   * Init fake columns for sorting
   * @param columns
   */
  public initFakeColumns(columns) {
    columns.forEach((column) => {
      const fakeColumn = new Column({
        title: column.name,
        name: column.value,
        sortable: true,
        direction: column.direction,
      });

      this.fakeSortingColumns.push(fakeColumn);
    });
  }

  /**
   * Set initial sorting
   * @param sort
   */
  public initialSortBy(sort: FsListSortConfig) {
    this._initialization = true;

    if (!sort) {
      this.sortByFirstSortbale();

      this._initialization = false;
      return;
    }

    this.sortByColumnWithName(sort.value);

    const direction = (sort.direction === void 0 || sort.direction === 'asc')
      ? SortingDirection.asc
      : SortingDirection.desc;
    this._setSortingDirection(direction);

    this._initialization = false;
  }

  /**
   * Sort by first of available sorting columns
   */
  public sortByFirstSortbale() {
    const column =
      this.sortingColumns.find(col => col.sortable);

    if (!column) { return; }

    this.sortBy(column);
    this.sortDirection(SortingDirection.asc);
  }

  /**
   * Destroy
   */
  public destroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  private _setSortingColumn(column: Column) {
    // Can't do sort by non sortable column
    if (!column.sortable) {
      return false;
    }

    // Column was ordered before
    if (column.ordered) {
      column.changeDirection();
    } else {
      [...this.fakeSortingColumns, ...this.sortingColumns]
        .filter((col) => col.ordered)
        .map((col) => col.ordered = false);

      column.ordered = true;
    }

    this.sortingColumn = column;
  }

  private _setSortingDirection(direction) {
    this.sortingColumn.sortingDirection = direction;
  }

  private _notifySortChanged() {
    if (this._initialization) { return; }
    this._sortingChanged.next({
      sortBy: this.sortingColumn.name,
      sortDirection: this.sortingColumn.direction
    });
  }
}
