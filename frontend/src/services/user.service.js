import api from './api';
export const getProfileAPI      = ()    => api.get('/users/profile');
export const updateProfileAPI   = (d)   => api.put('/users/profile', d);
export const changePasswordAPI  = (d)   => api.put('/users/change-password', d);
export const rateUserAPI        = (d)   => api.post('/users/rate', d);
