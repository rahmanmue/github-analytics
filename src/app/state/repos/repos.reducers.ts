import { createReducer, on } from '@ngrx/store';
import { setRepos } from './repos.actions';

export interface ReposState {
  repos: any[];
}

export const initialReposState: ReposState = {
  repos: [],
};

export const reposReducer = createReducer(
  initialReposState,
  on(setRepos, (state, { repos }) => ({
    ...state,
    repos,
  }))
);
