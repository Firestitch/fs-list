import { Component, OnInit, ViewChild } from '@angular/core';
import { FsApi } from '@firestitch/api';
import 'rxjs/add/operator/map';

import { FsListComponent, FsListConfig } from '../../../../src';
import { ActionType } from '../../../../src/app/models';


@Component({
  selector: 'sortable',
  templateUrl: 'sortable.component.html',
  styles: []
})
export class SortableComponent implements OnInit {

  @ViewChild('table')
  public table: FsListComponent;
  public config: FsListConfig;

  constructor(private _fsApi: FsApi) {}

  public ngOnInit() {

    this.config = {
      heading: 'Events',
      subheading: 'Subheading',
      status: true,
      filterInput: false,
      sorts: [
        {
          name: 'Last Login',
          value: 'last_login',
        },
      ],
      paging: {
        limits: [5, 15, 50, 150, 250, 500, 1000]
      },
      fetch: (query) => {
        query.count = 500;
        return this._fsApi.get('https://boilerplate.firestitch.com/api/dummy', query)
          .map(response => ({ data: response.data.objects, paging: response.data.paging }));
      },
    };
  }
}
