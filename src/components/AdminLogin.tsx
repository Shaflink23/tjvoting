import React, { useState } from 'react';
import { ArrowLeft, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../App';

interface AdminLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack }) => {
  const { setIsAdmin } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');

    // Simple mock authentication
    if (username === 'admin' && password === 'tekjuice123') {
      setIsAdmin(true);
      setTimeout(() => {
        setIsLoggingIn(false);
        onLogin();
      }, 1000);
    } else {
      setTimeout(() => {
        setIsLoggingIn(false);
        setError('Invalid credentials. Try admin / tekjuice123');
      }, 1000);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: '#f8f6f4' }}
    >
      <div className="max-w-md w-full">
        <div
          className="rounded-2xl shadow-lg p-8 flex flex-col items-center"
          style={{ backgroundColor: '#f6931b' }}
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
              <Lock className="h-8 w-8 text-[#f6931b]" />
            </div>
            <h2 className="text-2xl font-bold text-white">Admin Login</h2>
            <p className="text-white mt-2">Access the admin dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#f6931b]" />
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-white rounded-lg focus:ring-2 focus:ring-white focus:border-transparent bg-white text-[#f6931b] font-semibold"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#f6931b]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-white rounded-lg focus:ring-2 focus:ring-white focus:border-transparent bg-white text-[#f6931b] font-semibold"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#f6931b] hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="bg-white border border-[#f6931b] rounded-lg p-3">
              <p className="text-[#f6931b] text-sm">
                <strong>Demo credentials:</strong><br />
                Username: admin<br />
                Password: tekjuice123
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-white text-[#f6931b] py-3 px-4 rounded-lg font-semibold hover:bg-[#f6931b] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2 border-white"
            >
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
        <button
          onClick={onBack}
          className="flex items-center text-[#f6931b] hover:text-white mt-8 mx-auto font-semibold"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;