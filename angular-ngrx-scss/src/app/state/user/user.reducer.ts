import { Action, createReducer, on } from '@ngrx/store';
import { UserState } from './user.state';
import { fetchUserDataSuccess } from './user.actions';

const initialUserState: UserState = {
  avatar: '',
  bio: '',
  blog: '',
  company: '',
  email: '',
  followers: 0,
  following: 0,
  location: '',
  name: '',
  twitter_username: '',
  username: '',
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
