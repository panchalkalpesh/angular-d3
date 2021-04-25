import { createAction, props } from "@ngrx/store";
import { Friend } from "./friends.model";

export const ADD_FRIEND = createAction(
  '[Friends] Add',
  props<Friend>()
);

