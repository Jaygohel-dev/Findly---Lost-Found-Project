import api from './api';

export const fetchItemsAPI  = (params) => api.get('/items', { params });
export const fetchStatsAPI  = ()        => api.get('/items/stats');
export const fetchMyItemsAPI = ()       => api.get('/items/my');
export const fetchItemAPI   = (id)      => api.get(`/items/${id}`);
export const createItemAPI  = (data)    => api.post('/items', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateItemAPI  = (id, d)   => api.put(`/items/${id}`, d);
export const deleteItemAPI  = (id)      => api.delete(`/items/${id}`);
export const recoverItemAPI = (id)      => api.post(`/items/${id}/recover`);
export const matchItemsAPI  = (id, mid) => api.post(`/items/${id}/match`, { matchedItemId: mid });
