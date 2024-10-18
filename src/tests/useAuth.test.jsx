import { renderHook, act } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../features/Accounts/hooks/useAuth';
import { authEndpoints } from '../api/endpoints';
import * as React from 'react';
import { describe, beforeEach, test, expect, vi } from 'vitest';

vi.mock('../api/endpoints', () => ({
  authEndpoints: {
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    refreshToken: vi.fn(),
  },
}));

const wrapper = ({ children }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
};

describe('useAuth', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('should return isAuthenticated as false initially', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isAuthenticated).toBe(false);
  });

  test('should set isAuthenticated to true after successful login', async () => {
    authEndpoints.login.mockResolvedValue({
      data: { access: 'fake-token', refresh: 'fake-refresh-token' },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({ email: 'test@example.com', password: 'password' });
    });

    expect(result.current.isAuthenticated).toBe(true);
  });

  test('should set isAuthenticated to false after logout', async () => {
    authEndpoints.logout.mockResolvedValue({});

    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.setIsAuthenticated(true);
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
  });

  test('should call register function when register is called', async () => {
    authEndpoints.register.mockResolvedValue({
      data: { message: 'Registration successful' },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.register({ email: 'test@example.com', password: 'password', profile_name: 'testuser' });
    });

    expect(authEndpoints.register).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
      profile_name: 'testuser',
    });
  });
});