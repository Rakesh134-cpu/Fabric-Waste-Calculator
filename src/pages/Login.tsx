import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn } from '@/firebase/auth';
import { useAuthStore } from '@/store/authStore';
import { Scissors, Mail, Lock, ArrowRight, Leaf } from 'lucide-react';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signIn(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err?.message || 'Login failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url('/assets/images/auth-bg.png')` }}
    >
      {/* Dark overlay to ensure form readability if needed, though pic 2 shows it clear */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 shadow-glow-green mb-4">
            <Scissors className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">EcoCut AI</h1>
          <p className="text-gray-400 mt-1 flex items-center justify-center gap-1">
            <Leaf className="w-4 h-4 text-green-400" />
            Reduce Fabric Waste. Optimize Every Cut.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#2d3748] border border-slate-700/50 rounded-[1.25rem] p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="rakeshkumarraju070819@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#e2e8f0] border border-transparent rounded-xl
                    text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2
                    focus:ring-green-500 transition font-medium"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#e2e8f0] border border-transparent rounded-xl
                    text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2
                    focus:ring-green-500 transition font-medium"
                />
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-6
                bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold
                rounded-xl hover:from-green-600 hover:to-green-700 transition-all
                disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-green"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-green-400 hover:text-green-300 font-medium transition">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
