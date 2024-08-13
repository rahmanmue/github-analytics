import { createAction, props } from '@ngrx/store';

export const setRepos = createAction(
  '[Repos] Set Repos',
  props<{ repos: any[] }>()
);
