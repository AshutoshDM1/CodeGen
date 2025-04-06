'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GoogleLogin from '@/components/GoogleLogin';
import { signIn } from 'next-auth/react';

type Userdata = {
  email: string;
  name: string;
  password: string;
  callbackUrl: string;
  action: string;
  redirect: boolean;
};

const RegisterPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sendUserdata: Userdata = {
      email,
      name,
      password,
      callbackUrl: '/workspace',
      action: 'signup',
      redirect: true,
    };
    setIsLoading(true);
    await signIn('credentials', sendUserdata);
    setIsLoading(false);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md space-y-8 px-5 py-8 rounded-[15px] backdrop-blur-[40px] ">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-3xl font-bold text-white">Create an account</h2>
          <p className="text-gray-400">Please enter your details to sign up</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Name</label>
            <input
              type="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 rounded-lg bg-black/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Enter your Name"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 rounded-lg bg-black/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 rounded-lg bg-black/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-gradient-to-r from-cyan-300 to-green-300 hover:from-cyan-400 hover:to-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              'Sign up'
            )}
          </button>
        </form>
        <GoogleLogin />
        <div className="text-center">
          <span className="text-gray-400 text-sm">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/auth/login')}
              className="text-cyan-500 hover:text-cyan-400 hover:underline"
            >
              Login
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
