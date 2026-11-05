import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Lock, 
  Mail, 
  AlertCircle, 
  RefreshCw, 
  GitPullRequest, 
  Users, 
  BarChart3, 
  HelpCircle,
  Star,
  CheckCircle2
} from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        login(response.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page flex min-h-screen bg-[#FBFBF9] text-[#141b2b] overflow-hidden relative">
      {/* Background visual glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.05),transparent_50%)]"></div>

      <div className="flex flex-col md:flex-row w-full z-10">
        
        {/* Left Column: Branding and Key Features */}
        <div className="w-full md:w-1/2 flex flex-col justify-between p-8 md:p-16 bg-slate-950/45 border-r border-slate-900 backdrop-blur-md">
          <div className="space-y-8">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-extrabold tracking-widest bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                LEDGER &amp; CO.
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">Enterprise Edition</span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
                Enterprise Customer <br />Relationship Intelligence
              </h1>
              <p className="mt-3 text-slate-400 text-base leading-relaxed">
                High-performance database clustering, role-based workflows, and automated triggers built for modern growth teams.
              </p>
            </div>

            {/* Feature Cards List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="glass-card p-4 rounded-xl border border-slate-900/80 hover:border-slate-800 transition-all">
                <div className="p-2 bg-blue-500/10 rounded-lg w-fit text-blue-400 mb-3">
                  <GitPullRequest className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-200">Lead Pipeline</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Fully decoupled pipelines and multi-stage deal flow tracking.</p>
              </div>

              <div className="glass-card p-4 rounded-xl border border-slate-900/80 hover:border-slate-800 transition-all">
                <div className="p-2 bg-emerald-500/10 rounded-lg w-fit text-emerald-400 mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-200">Customer 360</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Unified profile view with integrated communication logs.</p>
              </div>

              <div className="glass-card p-4 rounded-xl border border-slate-900/80 hover:border-slate-800 transition-all">
                <div className="p-2 bg-indigo-500/10 rounded-lg w-fit text-indigo-400 mb-3">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-200">Sales Analytics</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Materialized view queries with Recharts visualizations.</p>
              </div>

              <div className="glass-card p-4 rounded-xl border border-slate-900/80 hover:border-slate-800 transition-all">
                <div className="p-2 bg-purple-500/10 rounded-lg w-fit text-purple-400 mb-3">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-200">Support Automation</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Ticket tracking logs with automatic audit trigger entries.</p>
              </div>
            </div>
          </div>

          {/* Testimonial / Social Proof */}
          <div className="mt-12 pt-8 border-t border-slate-900 flex items-center space-x-4">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-xs font-bold text-blue-400">NP</div>
              <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-xs font-bold text-emerald-400">PP</div>
              <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-xs font-bold text-amber-400">RG</div>
            </div>
            <div>
              <div className="flex text-amber-400 space-x-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                Trusted for complete relational compliance and performance metrics.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Portal Login Box */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 relative">
          <div className="w-full max-w-md space-y-6">
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-3xl font-extrabold text-white">Sign In to Portal</h2>
              <p className="text-slate-400 text-sm">Enter your enterprise credentials to access the workspace.</p>
            </div>

            {error && (
              <div className="flex items-center p-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none transition-all"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all shadow-lg shadow-blue-500/15 disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  'Sign In to Portal'
                )}
              </button>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-800/80"></div>
              <span className="flex-shrink mx-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">or continue with</span>
              <div className="flex-grow border-t border-slate-800/80"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center py-2.5 px-4 bg-slate-900 border border-slate-800/80 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800 transition-all"
              >
                <span>Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center py-2.5 px-4 bg-slate-900 border border-slate-800/80 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800 transition-all"
              >
                <span>Microsoft</span>
              </button>
            </div>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-500 flex items-center justify-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                <span>Single Sign-On (SSO) Enabled</span>
              </p>
            </div>

            {/* Sandbox Demo Credentials */}
            <div className="glass-card p-4 rounded-xl border border-slate-800/80 text-xs text-slate-400 space-y-1 mt-6">
              <p className="font-semibold text-slate-300 mb-1">💡 Sandbox Demo Credentials:</p>
              <p>• Admin: <code className="text-blue-400">naitik.pathak@gmail.com</code> / password: <code className="text-blue-400">Password@123</code></p>
              <p>• Sales: <code className="text-blue-400">priya.patel@gmail.com</code> / password: <code className="text-blue-400">Password@123</code></p>
              <p>• Support: <code className="text-blue-400">rohan.gupta@gmail.com</code> / password: <code className="text-blue-400">Password@123</code></p>
            </div>
            
            <div className="text-center mt-6">
              <p className="text-xs text-slate-500">
                New employee registration?{' '}
                <Link to="/register" className="text-blue-400 hover:underline font-bold transition-all">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
