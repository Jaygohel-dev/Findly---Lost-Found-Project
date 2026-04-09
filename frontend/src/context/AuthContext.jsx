import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { loginAPI, registerAPI, fetchMeAPI, logoutAPI } from '../services/auth.service';

const AuthContext = createContext(null);

const initialState = { user: null, token: localStorage.getItem('findly_token') || null, isAuthenticated: false, isLoading: true };

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'SET_LOADING':   return { ...state, isLoading: payload };
    case 'LOGIN_SUCCESS': return { ...state, user: payload.user, token: payload.token, isAuthenticated: true, isLoading: false };
    case 'LOGOUT':        return { ...initialState, token: null, isLoading: false };
    case 'UPDATE_USER':   return { ...state, user: { ...state.user, ...payload } };
    default:              return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem('findly_token');
      if (!token) { dispatch({ type: 'SET_LOADING', payload: false }); return; }
      try {
        const { data } = await fetchMeAPI();
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user: data.data.user, token } });
      } catch {
        localStorage.removeItem('findly_token');
        dispatch({ type: 'LOGOUT' });
      }
    };
    verify();
  }, []);

  const login = useCallback(async (creds) => {
    const { data } = await loginAPI(creds);
    localStorage.setItem('findly_token', data.data.token);
    dispatch({ type: 'LOGIN_SUCCESS', payload: data.data });
    toast.success(`Welcome back, ${data.data.user.name.split(' ')[0]}! 👋`);
    return data.data.user;
  }, []);

  const register = useCallback(async (userData) => {
    const { data } = await registerAPI(userData);
    localStorage.setItem('findly_token', data.data.token);
    dispatch({ type: 'LOGIN_SUCCESS', payload: data.data });
    toast.success(`Account created! Welcome to Findly 🎉`);
    return data.data.user;
  }, []);

  const logout = useCallback(async () => {
    try { await logoutAPI(); } catch {}
    localStorage.removeItem('findly_token');
    dispatch({ type: 'LOGOUT' });
    toast.success('Signed out successfully.');
  }, []);

  const updateUser = useCallback((u) => dispatch({ type: 'UPDATE_USER', payload: u }), []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
