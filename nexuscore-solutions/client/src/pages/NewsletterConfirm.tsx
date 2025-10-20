import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Loader } from '@/components/common/Loader';
import { CheckCircle, XCircle, Home } from 'lucide-react';
import api from '@/utils/api';
import { motion } from 'framer-motion';

const NewsletterConfirm: React.FC = () => {
  const { token } = useParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmSubscription = async () => {
      try {
        const response = await api.get(`/newsletter/confirm/${token}`);
        setStatus('success');
        setMessage(response.data.message);
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.error || 'Invalid or expired token');
      }
    };

    if (token) {
      confirmSubscription();
    }
  }, [token]);

  return (
    <PublicLayout>
      <div className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <Card className="p-8 text-center">
            {status === 'loading' && (
              <Loader size="lg" text="Confirming subscription..." />
            )}

            {status === 'success' && (
              <>
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">Subscription Confirmed!</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {message}
                </p>
                <Link to="/">
                  <Button variant="primary">
                    <Home className="mr-2" /> Go to Homepage
                  </Button>
                </Link>
              </>
            )}

            {status === 'error' && (
              <>
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">Confirmation Failed</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {message}
                </p>
                <Link to="/">
                  <Button variant="primary">
                    <Home className="mr-2" /> Go to Homepage
                  </Button>
                </Link>
              </>
            )}
          </Card>
        </motion.div>
      </div>
    </PublicLayout>
  );
};

export default NewsletterConfirm;