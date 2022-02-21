import { Action, createReducer, on } from '@ngrx/store';
import { UserState } from './user.state';
import { fetchUserDataSuccess } from './user.actions';

const initialUserState: UserState = {
  avatar: '',
  username: '',
  bio: '',
  email: '',
  location: '',
  name: '',
  twitter_username: '',
  company: '',
};

const userReducer = createReducer(
  initialUserState,

  on(fetchUserDataSuccess, (state, { userData }) => ({
    ...state,
    ...userData,
  })),
);

export function reducer(state: UserState | undefined, action: Action) {
  return userReducer(state, action);
}
