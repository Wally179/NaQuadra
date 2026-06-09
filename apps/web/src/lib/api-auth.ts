import { useAuthStore } from './stores/auth-store';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function authFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Use absolute URLs directly if passed, else prepend /api
  const url = endpoint.startsWith('http') ? endpoint : `/api${endpoint}`;

  const getHeaders = () => {
    const headers = new Headers(options.headers);
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return headers;
  };

  try {
    let response = await fetch(url, { ...options, headers: getHeaders() });

    // Handle 401 Unauthorized (Token Expired)
    if (response.status === 401) {
      const { refreshToken, setTokens, clearAuth } = useAuthStore.getState();
      
      if (refreshToken) {
        // Attempt to refresh
        try {
          const refreshRes = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshRes.ok) {
            const data = await refreshRes.json();
            setTokens(data.data.accessToken, data.data.refreshToken);
            
            // Retry original request
            response = await fetch(url, { ...options, headers: getHeaders() });
          } else {
            clearAuth();
            throw new ApiError(401, 'Session expired. Please login again.');
          }
        } catch (error) {
          clearAuth();
          throw new ApiError(401, 'Session expired. Please login again.');
        }
      } else {
        clearAuth();
        throw new ApiError(401, 'Unauthorized');
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(response.status, errorData.message || 'API request failed');
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, (error as Error).message || 'Network error');
  }
}
