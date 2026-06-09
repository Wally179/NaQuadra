'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { authFetch } from '@/lib/api-auth';
import type { UserProfile } from '@naquadra/types';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, setUser } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function loadProfile() {
      if (isAuthenticated) {
        try {
          const res = await authFetch<{ data: UserProfile }>('/auth/me');
          
          let combinedUser = { ...res.data };
          // Fetch preferences and combine them before setting user
          try {
            const prefsRes = await authFetch<{ data: any }>('/user-preferences');
            if (prefsRes?.data) {
              combinedUser = { ...combinedUser, ...prefsRes.data.nba, notificationPreferences: prefsRes.data.notifications, contentPreferences: prefsRes.data.content };
            }
          } catch (e) {
            console.error('Failed to load preferences', e);
          }
          
          setUser(combinedUser);
        } catch (error) {
          console.error('Failed to load profile', error);
          // authFetch already handles 401 and clears auth if refresh fails
        }
      }
    }

    if (mounted && isAuthenticated) {
      loadProfile();
    }
  }, [mounted, isAuthenticated, setUser]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
