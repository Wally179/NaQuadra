'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { authFetch } from '@/lib/api-auth';
import type { UserProfile } from '@naquadra/types';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, setUser, clearAuth } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function loadProfile() {
      if (isAuthenticated) {
        try {
          const res = await authFetch<{ data: UserProfile }>('/auth/me');
          setUser(res.data);
          
          // Also fetch preferences
          try {
            const prefsRes = await authFetch<{ data: any }>('/user-preferences');
            const combinedUser = { ...res.data, ...prefsRes.data.nba, notificationPreferences: prefsRes.data.notifications, contentPreferences: prefsRes.data.content };
            setUser(combinedUser);
          } catch (e) {
            console.error('Failed to load preferences', e);
          }
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
