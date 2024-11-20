import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationEndpoints } from '../../../api/endpoints';
import { useAuth } from '../../Accounts/hooks/useAuth';
import { toast } from 'react-toastify';

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  // Fetch notifications query
  const notificationsQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await notificationEndpoints.getNotifications();
      return response.data.results;
    },
    select: (data) => ({
      notifications: data,
      unreadCount: data.filter(notification => !notification.is_read).length
    }),
    enabled: isAuthenticated, // Only fetch if authenticated
    staleTime: 30 * 1000, // 30 seconds
    cacheTime: 5 * 60 * 1000, // 5 minutes
    onError: (error) => {
      if (error.response?.status !== 401) {
        toast.error(error.response?.data?.message || 'Failed to fetch notifications');
      }
    }
  });

  // Mutations
  const mutations = {
    markAsRead: useMutation({
      mutationFn: (notificationId) => 
        notificationEndpoints.markAsRead(notificationId),
      onSuccess: () => {
        queryClient.invalidateQueries(['notifications']);
        toast.success('Notification marked as read');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to mark notification as read');
      }
    }),

    markAllAsRead: useMutation({
      mutationFn: () => notificationEndpoints.markAllAsRead(),
      onSuccess: () => {
        queryClient.invalidateQueries(['notifications']);
        toast.success('All notifications marked as read');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to mark all notifications as read');
      }
    }),

    deleteNotification: useMutation({
      mutationFn: (notificationId) => 
        notificationEndpoints.deleteNotification(notificationId),
      onSuccess: () => {
        queryClient.invalidateQueries(['notifications']);
        toast.success('Notification deleted');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete notification');
      }
    })
  };

  return {
    // Query data
    notifications: notificationsQuery.data?.notifications || [],
    unreadCount: notificationsQuery.data?.unreadCount || 0,
    isLoading: notificationsQuery.isLoading,
    error: notificationsQuery.error,

    // Mutations
    markAsRead: mutations.markAsRead.mutateAsync,
    markAllAsRead: mutations.markAllAsRead.mutateAsync,
    deleteNotification: mutations.deleteNotification.mutateAsync,
    
    // Loading states
    isMarkingAsRead: mutations.markAsRead.isLoading,
    isMarkingAllAsRead: mutations.markAllAsRead.isLoading,
    isDeleting: mutations.deleteNotification.isLoading
  };
};

export default useNotifications;