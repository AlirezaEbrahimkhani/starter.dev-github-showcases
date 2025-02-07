import { createStore } from 'solid-js/store';

export type StoreProps = {
  token: string | null;
  user: Record<string, string> | null;
  isAuthenticated: boolean;
};

const [authStore, setAuth] = createStore<StoreProps>({
  token: null,
  user: null,
  get isAuthenticated() {
    return !!this.token;
  },
});

export default {
  authStore,
  setAuth,
};
