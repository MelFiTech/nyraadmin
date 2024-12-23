'use client';

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
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className="py-8 px-6 lg:flex-1 lg:flex lg:flex-col lg:justify-center lg:px-24">
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center relative px-4 py-8 lg:py-0">
        <div className="absolute top-4 right-4 hidden lg:block">
          <span className="text-dark text-sm">Having trouble? </span>
          <Link href="/help" className="text-sm text-dark font-medium hover:text-gray-700 underline">
            Get help →
          </Link>
        </div>

        <div className="bg-white rounded-lg p-6 lg:p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back, Admin!</h1>
          <p className="text-sm text-gray-600 mb-6">
            Not an admin? Nice try, buddy! 😉
          </p>

          {error && (
            <p className="text-sm text-red-600 mb-4">{error}</p>
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
            />

            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              className="w-full bg-primary hover:bg-primary/90 text-dark"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Log in'}
            </Button>
          </form>
        </div>

        {/* Help link for mobile */}
        <div className="absolute bottom-4 left-0 right-0 text-center lg:hidden">
          <span className="text-dark text-sm">Having trouble? </span>
          <Link href="/help" className="text-sm text-dark font-medium hover:text-gray-700 underline">
            Get help →
          </Link>
        </div>
      </div>
    </div>
  );
}