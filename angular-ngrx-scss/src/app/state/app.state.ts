import { ProfileState } from './profile/profile.state';
import { UserState } from './user';

export interface AppState {
  user: UserState;
  profile: ProfileState;
}
