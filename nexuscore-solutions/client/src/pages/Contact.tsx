import React, { useState } from 'react';
import api from '@/utils/api';

import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { Phone } from 'lucide-react';
import PhoneInput from '@/components/common/PhoneInput';

// Newsletter Form Component
const Contact: React.FC = () => {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('Please enter a valid email address');
      return;
    }
    if(!company){
      showError('Please enter your company name');
      return;
    }
    if(!message){
      showError('Please enter your message');
      return;
    }


    setLoading(true);

    try {
      await api.post('/contact', { email, company, message,name,phone });
      showSuccess('Please check your email to confirm subscription');
      setEmail('');
    } catch (error: any) {
      showError(error.response?.data?.error || 'Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-2xl mx-auto my-10 gap-2'>
    <form onSubmit={handleSubmit} className="gap-5  bg-white/10 p-2 rounded-lg shadow-md">

      <div className='gap-2 mt-4'>
        <Input
        label='Name'
        placeholder='Your personal name'
        value={name}
        onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className='gap-2 mt-4'>
        <Input
        label='Email'
        placeholder='Your email address'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className='gap-2 mt-4'>
       <PhoneInput
       
       />
      </div>
      
      
      <div className='gap-2 mt-4'>
        <Input
        placeholder='Company name '
        label='Company name'
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        />
      </div>
    

      <div className='gap-2 mt-4'>
      <Textarea
        placeholder='Your message'
        label='Your message'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        >
      </Textarea>

      </div>



      <Button
        type="submit"
        variant="secondary"
        loading={loading}
        disabled={loading}
        className='gap-2 mt-4'
      >
        Send us
      </Button>
     
    </form>
    </div>
  );
};

export default Contact;