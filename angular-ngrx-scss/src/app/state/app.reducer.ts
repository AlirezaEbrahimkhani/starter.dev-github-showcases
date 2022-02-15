import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';

import { reducer as userReducer } from './user/user.reducer';
import { reducer as profileReducer } from './profile/profile.reducer';

export const reducers: ActionReducerMap<AppState> = {
  user: userReducer,
  profile: profileReducer,
};
