import api from './api';
export const fetchInboxAPI    = ()          => api.get('/messages/inbox');
export const fetchMessagesAPI = (itemId)    => api.get(`/messages/${itemId}`);
export const sendMessageAPI   = (data)      => api.post('/messages', data);
