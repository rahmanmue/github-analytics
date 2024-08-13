import { createReducer, on } from '@ngrx/store';
import * as PaginationActions from './pagination.actions';

export interface PaginationState {
  perPage: number;
  currentPage: number;
  totalItems: number;
}

export const initialPaginationState: PaginationState = {
  perPage: 10,
  currentPage: 1,
  totalItems: 0,
};

export const paginationReducer = createReducer<PaginationState>(
  initialPaginationState,
  on(PaginationActions.setPerPage, (state, { perPage }) => ({
    ...state,
    perPage,
  })),
  on(PaginationActions.setCurrentPage, (state, { currentPage }) => ({
    ...state,
    currentPage,
  })),
  on(PaginationActions.setTotalItems, (state, { totalItems }) => ({
    ...state,
    totalItems,
  }))
);
