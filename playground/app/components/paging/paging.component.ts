import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

import { FsListConfig, PaginationStrategy } from '@firestitch/list';
import { ItemType } from '@firestitch/filter';


@Component({
  templateUrl: 'paging.component.html',
  styles: []
})
export class PagingComponent implements OnInit {

  @ViewChild('table', { static: true })
  public config: FsListConfig;

  constructor() {}

  public ngOnInit() {

    this.config = {
      filters: [
        {
          name: 'keyword',
          type: ItemType.Keyword,
          label: 'Search'
        },
      ],
      paging: {
        strategy: PaginationStrategy.Page,
      },
      heading: 'No Results',
      fetch: (query) => {
        return new Observable(observer => {
          observer.next({ data: [{ guid: 'sss'}], paging: {} });
          observer.complete();
      });
      },
    };
  }
}
