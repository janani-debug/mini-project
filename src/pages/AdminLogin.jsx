import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Key, ShieldCheck, ArrowLeft, Sparkles, UserPlus } from 'lucide-react';

export default function AdminLogin() {
  const { login, signupAdmin, currentUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);

  if (currentUser) {
    navigate('/admin/dashboard', { replace: true });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Admin Login Error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Invalid admin credentials. If this is your first time, click "Initialize Demo Admin Account" below.');
      } else {
        setError(err.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateDemoAdmin() {
    setError(null);
    setInfoMessage(null);
    const demoEmail = 'admin@domain.com';
    const demoPass = 'password123';

    try {
      setLoading(true);
      await signupAdmin(demoEmail, demoPass);
      setEmail(demoEmail);
      setPassword(demoPass);
      setInfoMessage('Demo Admin Account initialized! You can now log in.');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Demo Admin setup:', err);
      if (err.code === 'auth/email-already-in-use') {
        setEmail(demoEmail);
        setPassword(demoPass);
        setInfoMessage('Admin account (admin@domain.com) already exists. Click Login.');
      } else {
        setError('Could not initialize admin account: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        
        {/* Back Link */}
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Public Events
        </Link>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-600/25">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white">Admin Portal</h1>
          <p className="text-xs text-slate-400">
            Authorized event organizers & administration sign-in
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 text-xs text-rose-300">
            {error}
          </div>
        )}

        {infoMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-xs text-emerald-300">
            {infoMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="admin@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 text-slate-100 text-sm rounded-xl pl-10 pr-4 py-3 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 text-slate-100 text-sm rounded-xl pl-10 pr-4 py-3 outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        {/* Demo Admin Account Helper */}
        <div className="pt-4 border-t border-slate-800 text-center space-y-2">
          <p className="text-xs text-slate-500">First time setting up your admin account?</p>
          <button
            type="button"
            onClick={handleCreateDemoAdmin}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors border border-slate-700 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4 text-indigo-400" />
            Initialize Demo Admin Account (admin@domain.com)
          </button>
        </div>

      </div>
    </div>
  );
}
