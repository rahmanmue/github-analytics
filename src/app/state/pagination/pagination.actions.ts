import { createAction, props } from '@ngrx/store';

export const setCurrentPage = createAction(
  '[Pagination] Set Current Page',
  props<{ currentPage: number }>()
);

export const setPerPage = createAction(
  '[Pagination] Set Per Page',
  props<{ perPage: number }>()
);

export const setTotalItems = createAction(
  '[Pagination] Set Total Items',
  props<{ totalItems: number }>()
);
