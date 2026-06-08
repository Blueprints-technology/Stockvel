import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  csrfToken: string | null;
  user: any | null;
  setSession: (payload: { accessToken: string; csrfToken: string; user: any }) => void;
  clearSession: () => void;
}

export const authStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      csrfToken: null,
      user: null,
      setSession: ({ accessToken, csrfToken, user }) => set({ accessToken, csrfToken, user }),
      clearSession: () => set({ accessToken: null, csrfToken: null, user: null }),
    }),
    {
      name: 'marketpulse-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        csrfToken: state.csrfToken,
        user: state.user,
      }),
    },
  ),
);
