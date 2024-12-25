'use client';
import React from 'react';


import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 w-full">
        <div className="bg-white rounded-lg p-6 w-full max-w-[90%] sm:max-w-md mx-auto shadow-lg">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Welcome back, Admin!</h1>
          <p className="text-xs sm:text-sm text-gray-600 mb-6">
            Not an admin? Nice try, buddy! 😉
          </p>

          {error && (
            <p className="text-xs sm:text-sm text-red-600 mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              className="text-sm sm:text-base"
            />

            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              className="text-sm sm:text-base"
            />

            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              className="w-full bg-primary hover:bg-primary/90 text-dark text-sm sm:text-base py-3"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Log in'}
            </Button>
          </form>
        </div>
      </div>

      {/* Help Link - Fixed at bottom */}
      <div className="fixed bottom-4 left-0 right-0 text-center bg-transparent">
        <span className="text-dark text-xs sm:text-sm">Having trouble? </span>
        <Link href="/help" className="text-xs sm:text-sm text-dark font-medium hover:text-gray-700 underline">
          Get help →
        </Link>
      </div>
    </div>
  );
}