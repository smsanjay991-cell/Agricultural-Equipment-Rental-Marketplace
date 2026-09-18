import { fetchWithAuth } from './api';

export const notificationService = {
  getNotifications: async () => {
    const response = await fetchWithAuth('/notifications');
    if (response?.data && Array.isArray(response.data)) {
      return response;
    }
    return { data: Array.isArray(response) ? response : [], unreadCount: response?.unreadCount || 0 };
  },

  getUnreadCount: async () => {
    const response = await fetchWithAuth('/notifications/unread-count');
    if (typeof response?.unreadCount === 'number') return response.unreadCount;
    if (typeof response?.count === 'number') return response.count;
    return 0;
  },

  markAsRead: async (id) => {
    const response = await fetchWithAuth(`/notifications/${id}/read`, {
      method: 'PUT'
    });
    return response.data || response;
  },

  markAllAsRead: async () => {
    const response = await fetchWithAuth('/notifications/read-all', {
      method: 'PUT'
    });
    return response;
  }
};
