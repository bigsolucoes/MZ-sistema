import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthState, UserProfile, User } from '@/types';
// import { TokenResponse, googleLogout } from '@react-oauth/google'; // Removed
import { MOCK_USER_PROFILE } from '@/constants';

// fetchUserProfile is no longer needed as Google Sign-In is removed
// const fetchUserProfile = async (accessToken: string): Promise<UserProfile> => { ... };

const HARDCODED_PIN = "1234"; // For demo purposes

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isConfidentialMode: false,
      accessToken: null,
      isLoading: false,
      error: null,
      isAppForcedIdle: false,

      // login: async (tokenResponse: Omit<TokenResponse, 'error' | 'error_description' | 'error_uri'>) => { ... } // Removed

      pinLogin: async (pin: string): Promise<boolean> => {
        set({ isLoading: true, error: null });
        return new Promise((resolve) => {
          setTimeout(() => { // Simulate API call
            if (pin === HARDCODED_PIN) {
              const mockUser: User = {
                ...MOCK_USER_PROFILE,
                googleId: MOCK_USER_PROFILE.id, // Keep structure for mock data consistency
                accessToken: 'mock-pin-access-token-' + Date.now(),
              };
              set({
                user: mockUser,
                isAuthenticated: true,
                accessToken: mockUser.accessToken,
                isLoading: false,
                error: null,
              });
              resolve(true);
            } else {
              set({
                error: 'PIN Incorreto.',
                isLoading: false,
                isAuthenticated: false,
                user: null,
                accessToken: null,
              });
              resolve(false);
            }
          }, 500); // Simulate network delay
        });
      },

      logout: () => {
        // googleLogout(); // Removed
        set({
          user: null,
          isAuthenticated: false,
          accessToken: null,
          isLoading: false,
          error: null,
          isAppForcedIdle: false, // Reset forced idle on logout
        });
      },

      toggleConfidentialMode: () => {
        set((state) => ({ isConfidentialMode: !state.isConfidentialMode }));
      },
      
      setAccessToken: (token: string | null) => {
        set({ accessToken: token });
      },

      forceIdle: () => {
        if (get().isAuthenticated) {
          set({ isAppForcedIdle: true });
        }
      },
      resetForceIdle: () => {
        set({ isAppForcedIdle: false });
      }
    }),
    {
      name: 'auth-storage', 
      storage: createJSONStorage(() => localStorage), 
      partialize: (state) => ({ 
          user: state.user, 
          isAuthenticated: state.isAuthenticated, 
          isConfidentialMode: state.isConfidentialMode,
          accessToken: state.accessToken,
          // isAppForcedIdle is not persisted intentionally
        }), 
    }
  )
);