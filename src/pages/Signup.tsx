import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '@/firebase/auth';
import { useAuthStore } from '@/store/authStore';
import { Scissors, Mail, Lock, User, ArrowRight, Leaf, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const credential = await signUp(email, password, name);
      setUser({
        uid: credential.user.uid,
        email: credential.user.email,
        displayName: name,
        photoURL: null,
      });
      toast.success('Account created successfully! Welcome to EcoCut AI.');
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to create account. Email may already be in use.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="relative min-h-screen flex items-center justify-center px-4 py-12 text-slate-100 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/assets/images/auth-bg.png')` }}
    >
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      <div className="relative w-full max-w-md bg-[#2d3748] border border-slate-700/50 rounded-[1.25rem] p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 shadow-glow-green mb-4 flex items-center justify-center">
            <Scissors className="h-7 w-7 text-white transform -rotate-45" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Join EcoCut AI <Leaf className="h-5 w-5 text-green-400 inline" />
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Start saving fabric, reducing waste, and boosting profits today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full pl-10 pr-4 py-2.5 bg-[#e2e8f0] border border-transparent rounded-xl
                  text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2
                  focus:ring-green-500 transition font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Work Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@apparel-factory.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#e2e8f0] border border-transparent rounded-xl
                  text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2
                  focus:ring-green-500 transition font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Company / Apparel Brand (Optional)
            </label>
            <div className="relative">
              <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Wear"
                className="w-full pl-10 pr-4 py-2.5 bg-[#e2e8f0] border border-transparent rounded-xl
                  text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2
                  focus:ring-green-500 transition font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#e2e8f0] border border-transparent rounded-xl
                  text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2
                  focus:ring-green-500 transition font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 mt-2 py-3 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-green"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Create Free Account</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-400 hover:underline font-medium">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
