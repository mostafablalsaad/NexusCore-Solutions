import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Textarea } from '@/components/common/Textarea';
import { Modal } from '@/components/common/Modal';
import { Loader } from '@/components/common/Loader';
import { Badge } from '@/components/common/Badge';
import { Mail, Eye, EyeOff, MessageSquare, Trash2, Building, Phone } from 'lucide-react';
import api from '@/utils/api';
import { ContactMessage } from '@/types';
import { useToast } from '@/hooks/useToast';
import { formatDate } from '@/utils/helpers';

const ManageContact: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [responseNote, setResponseNote] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const { showSuccess, showError } = useToast();

  const fetchMessages = async () => {
    try {
      const response = await api.get('/contact/messages');
      setMessages(response.data.data || []);
    } catch (error) {
      showError('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleViewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setResponseNote(message.responseNote || '');
    setIsModalOpen(true);

    // Mark as read if not already
    if (!message.read) {
      try {
        await api.put(`/admin/contact/${message._id}/read`);
        fetchMessages();
      } catch (error) {
        console.error('Failed to mark message as read');
      }
    }
  };

  const handleToggleRead = async (id: string, currentStatus: boolean) => {
    try {
      await api.put(`/admin/contact/${id}/read`, { read: !currentStatus });
      showSuccess(`Message marked as ${!currentStatus ? 'read' : 'unread'}`);
      fetchMessages();
    } catch (error) {
      showError('Failed to update message status');
    }
  };

  const handleSaveResponse = async () => {
    if (!selectedMessage) return;

    try {
      await api.put(`/admin/contact/${selectedMessage._id}/respond`, {
        responseNote,
        responded: true,
      });
      showSuccess('Response saved successfully');
      setIsModalOpen(false);
      fetchMessages();
    } catch (error) {
      showError('Failed to save response');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await api.delete(`/admin/contact/${id}`);
      showSuccess('Message deleted successfully');
      fetchMessages();
    } catch (error) {
      showError('Failed to delete message');
    }
  };

  const filteredMessages = messages.filter(message => {
    if (filter === 'unread') return !message.read;
    if (filter === 'read') return message.read;
    return true;
  });

  if (loading) {
    return (
      <AdminLayout>
        <Loader size="lg" text="Loading messages..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Contact Messages</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Total messages: {messages.length} ({messages.filter(m => !m.read).length} unread)
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'unread' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Unread
            </Button>
            <Button
              variant={filter === 'read' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('read')}
            >
              Read
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredMessages.length === 0 ? (
            <Card className="p-8 text-center">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No messages found</p>
            </Card>
          ) : (
            filteredMessages.map((message) => (
              <Card
                key={message._id}
                className={`p-6 cursor-pointer transition-all ${
                  !message.read ? 'border-l-4 border-primary-600 bg-primary-50 dark:bg-primary-900/10' : ''
                }`}
                hoverable
                onClick={() => handleViewMessage(message)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{message.name}</h3>
                      {!message.read && <Badge variant="primary" size="sm">New</Badge>}
                      {message.responded && <Badge variant="success" size="sm">Responded</Badge>}
                    </div>
                    <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {message.email}
                      </div>
                      {message.company && (
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          {message.company}
                        </div>
                      )}
                      {message.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {message.phone}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-2">
                      {message.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(message.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleRead(message._id, message.read)}
                      title={message.read ? 'Mark as unread' : 'Mark as read'}
                    >
                      {message.read ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(message._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* View/Respond Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedMessage(null);
            setResponseNote('');
          }}
          title="Message Details"
          size="lg"
        >
          {selectedMessage && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">From</label>
                <p className="text-lg font-semibold">{selectedMessage.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <p className="text-sm">{selectedMessage.email}</p>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <p className="text-sm">{selectedMessage.phone}</p>
                  </div>
                )}
              </div>
              {selectedMessage.company && (
                <div>
                  <label className="block text-sm font-medium mb-1">Company</label>
                  <p className="text-sm">{selectedMessage.company}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Received</label>
                <p className="text-sm text-gray-500">{formatDate(selectedMessage.createdAt)}</p>
              </div>
              <div>
                <Textarea
                  label="Response Note (Internal)"
                  value={responseNote}
                  onChange={(e) => setResponseNote(e.target.value)}
                  rows={4}
                  placeholder="Add internal notes about your response..."
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={handleSaveResponse} fullWidth icon={<MessageSquare />}>
                  Save Response Note
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedMessage(null);
                    setResponseNote('');
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default ManageContact;
