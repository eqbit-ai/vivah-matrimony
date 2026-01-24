'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bell, Heart, Eye, Calendar, MessageSquare, CheckCheck, Trash2, Loader2 } from 'lucide-react';
import { notificationsApi } from '@/lib/api';
import { Notification, NotificationType } from '@/types';
import { cn, formatDate, getRelativeTime } from '@/lib/utils';
import toast from 'react-hot-toast';

const notificationIcons: Record<NotificationType, any> = {
  INTEREST_RECEIVED: Heart,
  INTEREST_ACCEPTED: Heart,
  INTEREST_REJECTED: Heart,
  PROFILE_VIEW: Eye,
  ADMIN_MESSAGE: MessageSquare,
  MEETING_SCHEDULED: Calendar,
};

const notificationColors: Record<NotificationType, string> = {
  INTEREST_RECEIVED: 'bg-rose-100 text-rose-600',
  INTEREST_ACCEPTED: 'bg-green-100 text-green-600',
  INTEREST_REJECTED: 'bg-gray-100 text-gray-600',
  PROFILE_VIEW: 'bg-blue-100 text-blue-600',
  ADMIN_MESSAGE: 'bg-purple-100 text-purple-600',
  MEETING_SCHEDULED: 'bg-amber-100 text-amber-600',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationsApi.getNotifications(1, 50);
        setNotifications(data.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    setMarkingAll(true);
    try {
      await notificationsApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    } finally {
      setMarkingAll(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationsApi.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-16 bg-gray-200 rounded-xl animate-pulse" />
        <div className="space-y-4">{[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse" />)}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">{unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllAsRead} disabled={markingAll} className="btn-outline flex items-center gap-2">
            {markingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4" />}
            Mark All as Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Notifications</h3>
          <p className="text-gray-600">You're all caught up! We'll notify you when something happens.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification, index) => {
            const Icon = notificationIcons[notification.type] || Bell;
            const colorClass = notificationColors[notification.type] || 'bg-gray-100 text-gray-600';

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className={cn('glass-card p-4 flex items-start gap-4 transition-all', !notification.isRead && 'bg-primary-50/50 border-primary-200')}
                onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
              >
                <div className={cn('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', colorClass)}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className={cn('font-semibold text-gray-900', !notification.isRead && 'font-bold')}>{notification.title}</h3>
                      <p className="text-gray-600 text-sm mt-0.5">{notification.message}</p>
                    </div>
                    {!notification.isRead && <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-2" />}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{getRelativeTime(notification.createdAt)}</p>
                </div>

                <button onClick={(e) => { e.stopPropagation(); handleDelete(notification.id); }} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
