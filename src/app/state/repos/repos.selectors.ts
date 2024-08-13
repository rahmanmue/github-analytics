import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReposState } from './repos.reducers';

export const selectReposState = createFeatureSelector<ReposState>('repos');

export const selectRepos = createSelector(
  selectReposState,
  (state) => state.repos
);
