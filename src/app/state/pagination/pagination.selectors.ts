import { createSelector, createFeatureSelector } from '@ngrx/store';
import { PaginationState } from './pagination.reducer';

export const selectPaginationState =
  createFeatureSelector<PaginationState>('pagination');

export const selectPagination = createSelector(
  selectPaginationState,
  (state) => state
);

export const selectCurrentPage = createSelector(
  selectPaginationState,
  (state) => state.currentPage
);
