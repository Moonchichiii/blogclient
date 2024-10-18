import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../features/Accounts/hooks/useAuth';
import SignUpForm from '../features/Accounts/SignUpForm';
import showToast from '../utils/toast';

vi.mock('../utils/toast', () => ({
  default: vi.fn(),
}));

vi.mock('../features/Accounts/hooks/useAuth', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }) => <div>{children}</div>,
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const renderWithProviders = (ui) => {
  const queryClient = new QueryClient();
  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{ui}</AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

describe('SignUpForm Component', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      register: vi.fn(),
    });
  });

  test('renders signup form', () => {
    const { getByPlaceholderText, getByText } = renderWithProviders(<SignUpForm />);
    
    expect(getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
    expect(getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(getByPlaceholderText('Profile Name')).toBeInTheDocument();
    expect(getByText('Sign Up')).toBeInTheDocument();
    expect(getByText('Password Strength:')).toBeInTheDocument();
  });

  test('shows error messages for empty fields', async () => {
    const { getByText } = renderWithProviders(<SignUpForm />);
    
    fireEvent.click(getByText('Sign Up'));

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
      expect(screen.getByText('Profile name is required')).toBeInTheDocument();
    });
  });

  test('shows error message for mismatched passwords', async () => {
    const { getByPlaceholderText, getByText } = renderWithProviders(<SignUpForm />);
    
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(getByPlaceholderText('Confirm Password'), { target: { value: 'password321' } });
    fireEvent.click(getByText('Sign Up'));

    await waitFor(() => {
      expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
    });
  });

  test('updates password strength meter', async () => {
    const { getByPlaceholderText, getByText } = renderWithProviders(<SignUpForm />);
    
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'weakpass' } });
    expect(getByText('Password Strength: Weak')).toBeInTheDocument();

    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'StrongPass123!' } });
    expect(getByText('Password Strength: Very Strong')).toBeInTheDocument();
  });

  test('calls register function on successful form submission', async () => {
    const mockRegister = vi.fn();
    vi.mocked(useAuth).mockReturnValue({
      register: mockRegister,
    });

    const { getByPlaceholderText, getByText } = renderWithProviders(<SignUpForm />);
    
    fireEvent.change(getByPlaceholderText('Email address'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(getByPlaceholderText('Confirm Password'), { target: { value: 'password123' } });
    fireEvent.change(getByPlaceholderText('Profile Name'), { target: { value: 'testuser' } });
    
    fireEvent.click(getByText('Sign Up'));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        password2: 'password123',
        profile_name: 'testuser',
      });
    });

    expect(showToast).toHaveBeenCalledWith('Registration successful', 'success');
  });
});