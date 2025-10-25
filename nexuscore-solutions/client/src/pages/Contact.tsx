import React, { useState } from 'react';
import api from '@/utils/api';

import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/common/Button';

// Newsletter Form Component
const Contact: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await api.post('/newsletter/subscribe', { email });
      showSuccess('Please check your email to confirm subscription');
      setEmail('');
    } catch (error: any) {
      showError(error.response?.data?.error || 'Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-row md:flex-row gap-4 max-w-md mx-auto items-center justify-center '>
    <form onSubmit={handleSubmit} className="flex w-full gap-2 flex-col md:flex-row bg-white/10 p-4 rounded-lg shadow-md">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
      />
      <Button
        type="submit"
        variant="secondary"
        loading={loading}
        disabled={loading}
      >
        Subscribe
      </Button>
    </form>
    </div>
  );
};

export default Contact;