import api from './api';
export const registerAPI = (d)  => api.post('/auth/register', d);
export const loginAPI    = (d)  => api.post('/auth/login', d);
export const fetchMeAPI  = ()   => api.get('/auth/me');
export const logoutAPI   = ()   => api.post('/auth/logout');
