import { Action, createReducer, on } from '@ngrx/store';
import { ADD_FRIEND } from './friends.actions';
import { Friend } from './friends.model';

export const INITIAL_STATE: Friend[] = [];

/* tslint:disable: variable-name */
const _friendsReducer = createReducer(
  INITIAL_STATE,
  on(ADD_FRIEND, (state, action) => {
    return [...state, action];
  })
);

export function friendsReducer(state: Friend[] = INITIAL_STATE, action: Action): Friend[] {
  return _friendsReducer(state, action);
}
