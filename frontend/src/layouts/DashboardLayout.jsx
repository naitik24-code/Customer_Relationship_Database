import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  GitPullRequest,
  Briefcase,
  Layers,
  HelpCircle,
  BarChart3,
  LogOut,
  UserCheck,
  Menu,
  X,
  User,
  Shield,
  Search,
  PlusCircle
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Base navigation links
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['Admin', 'Manager', 'Sales Executive', 'Support Agent'] },
    { name: 'Customers', path: '/customers', icon: Users, roles: ['Admin', 'Manager', 'Sales Executive', 'Support Agent'] },
    { name: 'Leads', path: '/leads', icon: GitPullRequest, roles: ['Admin', 'Manager', 'Sales Executive'] },
    { name: 'Opportunities', path: '/opportunities', icon: Briefcase, roles: ['Admin', 'Manager', 'Sales Executive'] },
    { name: 'Products', path: '/products', icon: Layers, roles: ['Admin', 'Manager', 'Sales Executive', 'Support Agent'] },
    { name: 'Support Tickets', path: '/tickets', icon: HelpCircle, roles: ['Admin', 'Manager', 'Sales Executive', 'Support Agent'] },
    { name: 'Employees', path: '/employees', icon: UserCheck, roles: ['Admin', 'Manager'] },
    { name: 'Reports', path: '/reports', icon: BarChart3, roles: ['Admin', 'Manager'] },
    { name: 'Audit Logs', path: '/audit', icon: Shield, roles: ['Admin'] },
  ];

  // Filter based on user's role
  const filteredNavItems = navItems.filter(item => user && item.roles.includes(user.role));

  const getPageTitle = () => {
    const activeItem = navItems.find(item => item.path === location.pathname);
    return activeItem ? activeItem.name : 'CRM Suite';
  };

  return (
    <div className="app-shell flex h-screen bg-[#f4f1eb] overflow-hidden text-slate-100">
      
      {/* Sidebar for Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-slate-950/80 backdrop-blur-sm">
          <div className="relative flex flex-col flex-1 w-full max-w-xs pt-5 pb-4 bg-[#0a0a0d] border-r border-slate-900">
            <div className="absolute top-0 right-0 p-1 -mr-12">
              <button
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-center w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            
            <div className="flex items-center justify-between px-4 pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">CRM SUITE</span>
              </div>
            </div>

            <nav className="flex-1 px-2 mt-5 space-y-1 overflow-y-auto scrollbar-thin">
              {filteredNavItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-400 border-l-4 border-blue-500 pl-3'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </NavLink>
              ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-slate-800 rounded-full">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-slate-200">{user?.email}</p>
                  <p className="text-xs text-blue-400 font-semibold uppercase">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-[#F5F4F0] border-r border-slate-800/80 backdrop-blur-xl">
          <div className="flex items-center h-20 px-5 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <img src="/aethelgard-mark.svg" alt="Ledger & Co." className="h-9 w-9 rounded" />
              <div><span className="block text-sm font-extrabold text-[#141b2b] tracking-tight">Ledger &amp; Co.</span><span className="block text-[9px] font-bold uppercase tracking-[.18em] text-[#515c71]">Executive desk</span></div>
            </div>
          </div>
          
          <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto scrollbar-thin">
            <button className="mb-5 flex w-full items-center justify-center gap-2 rounded bg-[#9d3d26] px-3 py-2.5 text-xs font-semibold text-white"><PlusCircle className="h-4 w-4" /> Quick Create</button>
            {filteredNavItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#eef0ff] text-[#9d3d26] border-l-2 border-[#9d3d26] shadow-none'
                      : 'text-[#515c71] hover:bg-white hover:text-[#141b2b] border border-transparent'
                  }`
                }
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-800/80">
            <div className="flex items-center p-3 mb-3 bg-slate-950/40 border border-slate-800/50 rounded-xl">
              <div className="p-1.5 bg-blue-500/10 rounded-lg">
                <User className="w-5 h-5 text-blue-400" />
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-xs font-semibold text-slate-200 truncate">{user?.email}</p>
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-red-400 rounded-xl hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-white/90 border-b border-slate-800/80 backdrop-blur-xl">
          <div className="hidden lg:flex items-center justify-between px-5 sm:px-8 py-1.5 bg-[#F5F4F0] border-b border-[#E5E5DF] text-[10px] uppercase tracking-wider text-[#475569]"><span className="font-semibold text-[#141b2b]">Editorial Executive Ledger <span className="mx-2 text-[#9d3d26]">·</span> Volume IX · Issue 44</span><span><span className="mr-4 text-[#5B7563]">● Advisory desk: active</span> Pipeline telemetry synchronized</span></div>
          <div className="flex items-center justify-between min-h-16 px-5 sm:px-8">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="px-4 text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden items-center gap-2 md:flex"><Search className="h-4 w-4 text-[#64748B]" /><input aria-label="Search workspace" placeholder="Search accounts, contacts..." className="w-60 bg-transparent text-xs outline-none placeholder:text-[#94A3B8]" /></div><div><p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#9d3d26]">Sovereign archive / portfolio control</p><h1 className="text-lg font-bold text-[#141b2b]">{getPageTitle()}</h1></div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full border border-emerald-400/15 bg-emerald-400/5 text-xs text-emerald-300"><div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>All systems operational</div>
          </div>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-transparent scrollbar-thin">
          <div className="page-shell max-w-[1600px] mx-auto">{children}</div>
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;
