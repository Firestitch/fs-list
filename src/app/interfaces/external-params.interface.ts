import { SortingDirection } from '../models/column.model';

export type ExternalParams = IExternalPaginationParams & IExternalSortingParams;

export type ExternalQueryPagination = Record<keyof IExternalPaginationParams, string>;
export type ExternalQuerySorting = IExternalSortingParams;

interface IExternalPaginationParams {
  page: number;
  limit: number;
}

interface IExternalSortingParams {
  sortName: string;
  sortDirection: SortingDirection;
}
