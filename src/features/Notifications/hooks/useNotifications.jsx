import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../api/apiConfig';

export const useNotifications = () => {
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await api.get('/api/notifications/');
      return response.data.results;
    },
    select: (data) => ({
      notifications: data,
      unreadCount: data.filter(notification => !notification.is_read).length
    })
  });

  // Mark single notification as read
  const markAsRead = useMutation({
    mutationFn: async (notificationId) => {
      return api.patch(`/api/notifications/${notificationId}/mark-read/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  // Mark all notifications as read
  const markAllAsRead = useMutation({
    mutationFn: async () => {
      return api.patch('/api/notifications/mark-all-read/');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  // Delete notification
  const deleteNotification = useMutation({
    mutationFn: async (notificationId) => {
      return api.delete(`/api/notifications/${notificationId}/delete/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  return {
    notifications: notifications.notifications || [],
    unreadCount: notifications.unreadCount || 0,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
};