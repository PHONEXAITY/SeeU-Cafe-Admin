'use client'
import React, { useState } from 'react';
import { FaBell, FaCheck, FaTrash, FaCog, FaFilter, FaPlus, FaEdit } from 'react-icons/fa';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Notification Management Modal for Add/Edit
const NotificationManageModal = ({ isOpen, onClose, mode, notification, onSave }) => {
  const [formData, setFormData] = useState(
    mode === 'edit' 
      ? notification 
      : {
          title: '',
          message: '',
          status: 'unread',
          recipients: 'all', // all, specific-users, role-based
          specificUsers: '',
          roleType: 'user',
          scheduledTime: '',
        }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit Notification' : 'Create New Notification'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter notification title"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Enter notification message"
              className="mt-1"
              required
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="recipients">Recipients</Label>
            <Select
              value={formData.recipients}
              onValueChange={(value) => setFormData({ ...formData, recipients: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select recipients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="specific-users">Specific Users</SelectItem>
                <SelectItem value="role-based">Role Based</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.recipients === 'specific-users' && (
            <div>
              <Label htmlFor="specificUsers">User IDs or Emails</Label>
              <Textarea
                id="specificUsers"
                value={formData.specificUsers}
                onChange={(e) => setFormData({ ...formData, specificUsers: e.target.value })}
                placeholder="Enter user IDs or emails (comma separated)"
                className="mt-1"
                rows={2}
              />
            </div>
          )}

          {formData.recipients === 'role-based' && (
            <div>
              <Label htmlFor="roleType">Role Type</Label>
              <Select
                value={formData.roleType}
                onValueChange={(value) => setFormData({ ...formData, roleType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrators</SelectItem>
                  <SelectItem value="moderator">Moderators</SelectItem>
                  <SelectItem value="user">Regular Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="scheduledTime">Schedule Time (Optional)</Label>
            <Input
              id="scheduledTime"
              type="datetime-local"
              value={formData.scheduledTime}
              onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
              className="mt-1"
            />
          </div>

          <DialogFooter>
            <Button type="submit">
              {mode === 'edit' ? 'Update Notification' : 'Create Notification'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const NotificationItem = ({ notification, onMarkRead, onDelete, onEdit }) => {
  const getStatusColor = (status) => {
    return status === 'unread' ? 'bg-blue-50' : 'bg-white';
  };

  return (
    <div className={`p-4 ${getStatusColor(notification.status)} hover:bg-gray-50 transition-colors`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <FaBell className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        <div className="flex-grow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-gray-900">{notification.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              <div className="flex gap-2 mt-1">
                <p className="text-xs text-gray-500">{notification.time}</p>
                {notification.recipients && (
                  <p className="text-xs text-blue-600">
                    To: {notification.recipients === 'all' 
                      ? 'All Users' 
                      : notification.recipients === 'specific-users' 
                        ? 'Specific Users' 
                        : `${notification.roleType} Role`}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(notification)}
                className="text-blue-600 hover:text-blue-700"
              >
                <FaEdit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(notification.id)}
                className="text-red-600 hover:text-red-700"
              >
                <FaTrash className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationsList = () => {
  const [filter, setFilter] = useState('all');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Message",
      message: "You have received a new message from John Doe",
      time: "5 minutes ago",
      status: "unread",
      recipients: "all"
    },
    {
      id: 2,
      title: "System Update",
      message: "A new system update is available",
      time: "1 hour ago",
      status: "read",
      recipients: "all"
    },
    {
      id: 3,
      title: "Meeting Reminder",
      message: "Team meeting starts in 30 minutes",
      time: "2 hours ago",
      status: "unread",
      recipients: "role-based",
      roleType: "admin"
    }
  ]);

  const handleDelete = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const handleEdit = (notification) => {
    setSelectedNotification(notification);
    setManageModalOpen(true);
  };

  const handleSave = (formData) => {
    if (selectedNotification) {
      // Edit existing notification
      setNotifications(notifications.map(notif =>
        notif.id === selectedNotification.id ? { ...formData, id: notif.id } : notif
      ));
    } else {
      // Add new notification
      setNotifications([
        ...notifications,
        {
          ...formData,
          id: notifications.length + 1,
          time: 'Just now',
          status: 'unread'
        }
      ]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FaBell className="w-6 h-6" />
              Notifications Management
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="default"
              onClick={() => {
                setSelectedNotification(null);
                setManageModalOpen(true);
              }}
            >
              <FaPlus className="w-4 h-4 mr-2" />
              New Notification
            </Button>
            <Button
              variant="outline"
              onClick={() => setSettingsOpen(true)}
            >
              <FaCog className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex gap-2">
          {['all', 'unread', 'read'].map((filterType) => (
            <Button
              key={filterType}
              variant={filter === filterType ? 'default' : 'outline'}
              onClick={() => setFilter(filterType)}
              size="sm"
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-lg divide-y divide-gray-200">
        {notifications
          .filter(notif => filter === 'all' || notif.status === filter)
          .map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
      </div>

      <NotificationManageModal
        isOpen={manageModalOpen}
        onClose={() => {
          setManageModalOpen(false);
          setSelectedNotification(null);
        }}
        mode={selectedNotification ? 'edit' : 'create'}
        notification={selectedNotification}
        onSave={handleSave}
      />

      <NotificationSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
};
const NotificationSettingsModal = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    newMessages: true,
    mentions: true,
    updates: false,
    notificationSound: true,
    desktopNotifications: false,
    digestEmails: 'daily',
  });

  const handleSave = () => {
    console.log('Saving settings:', settings);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Notification Preferences</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-6">
          {/* Delivery Preferences */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-gray-700">Delivery Preferences</h4>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email">Email Notifications</Label>
                <div className="text-sm text-gray-500">Receive notifications via email</div>
              </div>
              <Switch
                id="email"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, emailNotifications: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push">Push Notifications</Label>
                <div className="text-sm text-gray-500">Receive push notifications in-app</div>
              </div>
              <Switch
                id="push"
                checked={settings.pushNotifications}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({ ...prev, pushNotifications: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="desktop">Desktop Notifications</Label>
                <div className="text-sm text-gray-500">Show notifications on desktop</div>
              </div>
              <Switch
                id="desktop"
                checked={settings.desktopNotifications}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({ ...prev, desktopNotifications: checked }))
                }
              />
            </div>
          </div>

          {/* Notification Types */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-gray-700">Notify me about:</h4>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="messages">New Messages</Label>
                <div className="text-sm text-gray-500">Direct and group messages</div>
              </div>
              <Switch
                id="messages"
                checked={settings.newMessages}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({ ...prev, newMessages: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="mentions">Mentions</Label>
                <div className="text-sm text-gray-500">When you're mentioned in comments</div>
              </div>
              <Switch
                id="mentions"
                checked={settings.mentions}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({ ...prev, mentions: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="updates">System Updates</Label>
                <div className="text-sm text-gray-500">Important system and security updates</div>
              </div>
              <Switch
                id="updates"
                checked={settings.updates}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({ ...prev, updates: checked }))
                }
              />
            </div>
          </div>

          {/* Additional Settings */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-gray-700">Additional Settings</h4>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sound">Notification Sound</Label>
                <div className="text-sm text-gray-500">Play sound for new notifications</div>
              </div>
              <Switch
                id="sound"
                checked={settings.notificationSound}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({ ...prev, notificationSound: checked }))
                }
              />
            </div>
            <div>
              <Label htmlFor="digest">Email Digest Frequency</Label>
              <Select
                value={settings.digestEmails}
                onValueChange={(value) =>
                  setSettings(prev => ({ ...prev, digestEmails: value }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsList;