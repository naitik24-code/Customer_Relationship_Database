import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Check, ChevronRight, HelpCircle as CircleHelp, ShieldCheck, Sparkles, Users, Zap } from 'lucide-react';

const features = [
  { icon: Users, title: 'Customer 360', text: 'Keep contacts, activity, support history, and preferences in one clear profile.' },
  { icon: BarChart3, title: 'Live revenue view', text: 'See pipeline health, conversion trends, and forecast signals as your team works.' },
  { icon: ShieldCheck, title: 'Built for control', text: 'Role based access and audit trails keep every action accountable and visible.' },
];

const Home = () => (
  <div className="home-page min-h-screen overflow-hidden bg-[#07111f] text-slate-100">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(34,211,238,.15),transparent_28rem),radial-gradient(circle_at_85%_20%,rgba(37,99,235,.2),transparent_32rem)]" />
    <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-10">
      <Link to="/" className="flex items-center gap-3" aria-label="CRM Suite home">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 font-black text-white shadow-lg shadow-blue-600/25">C</div>
        <div><span className="block font-extrabold tracking-tight text-white">Aethelgard CRM</span><span className="block text-[10px] font-bold uppercase tracking-[.2em] text-cyan-300">Relationship intelligence</span></div>
      </Link>
      <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex" aria-label="Primary navigation">
        <a href="#platform" className="hover:text-white">Platform</a><a href="#workflow" className="hover:text-white">Workflow</a><a href="#security" className="hover:text-white">Security</a>
      </nav>
      <div className="flex items-center gap-3"><Link to="/login" className="hidden text-sm font-semibold text-slate-300 hover:text-white sm:block">Sign in</Link><Link to="/register" className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-900 shadow-lg shadow-cyan-950/20 hover:-translate-y-0.5 hover:bg-cyan-50">Get started <ArrowRight className="ml-1 inline h-4 w-4" /></Link></div>
    </header>

    <main className="relative z-10">
      <section className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:pb-28 lg:pt-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[.16em] text-cyan-200"><Sparkles className="h-3.5 w-3.5" /> Enterprise relationship intelligence</div>
          <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.02] tracking-[-.05em] text-white sm:text-6xl lg:text-7xl">Customer relationship intelligence for <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">modern operations.</span></h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">A calm, unified operational ledger for sales pipelines, institutional accounts, and mission-critical support with audited clarity.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link to="/register" className="inline-flex items-center justify-center rounded-xl bg-cyan-300 px-5 py-3.5 font-bold text-slate-950 shadow-xl shadow-cyan-500/15 hover:-translate-y-0.5 hover:bg-cyan-200">Start building momentum <ArrowRight className="ml-2 h-4 w-4" /></Link><Link to="/login" className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/40 px-5 py-3.5 font-bold text-white hover:border-slate-500 hover:bg-slate-800/60">Explore your workspace <ChevronRight className="ml-2 h-4 w-4" /></Link></div>
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400"><span><Check className="mr-1 inline h-4 w-4 text-emerald-400" /> Role-based workflows</span><span><Check className="mr-1 inline h-4 w-4 text-emerald-400" /> Audit-ready by default</span></div>
        </div>
        <div className="relative">
          <div className="absolute -inset-5 rounded-[2rem] bg-cyan-400/10 blur-3xl" />
          <div className="relative rounded-xl border border-white/10 bg-slate-900/75 p-4 shadow-2xl shadow-blue-950/40 backdrop-blur-xl sm:p-6">
            <div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-300">Command center</p><p className="mt-1 text-lg font-bold text-white">Good morning, Naitik</p></div><div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-300">Live data</div></div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[['Pipeline','₹24.8L','+18.4%'],['Customers','1,248','+12.6%'],['Win rate','68.2%','+4.8%'],['Open cases','32','-8.1%']].map(([label,value,change]) => <div className="rounded-2xl border border-white/10 bg-white/[.04] p-3" key={label}><p className="text-[11px] text-slate-400">{label}</p><p className="mt-2 text-xl font-extrabold text-white">{value}</p><p className="mt-1 text-[11px] font-bold text-emerald-300">{change}</p></div>)}</div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-cyan-400/5 p-4"><div className="flex items-center justify-between"><p className="text-sm font-bold text-white">Revenue forecast</p><p className="text-xs text-slate-400">Last 6 months</p></div><div className="mt-5 flex h-32 items-end gap-2">{[28,42,36,62,55,78,67,92,82,100].map((height, i) => <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-blue-600 to-cyan-300 opacity-80" style={{ height: `${height}%` }} />)}</div></div>
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.035] p-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-400/10 text-amber-300"><Zap className="h-4 w-4" /></div><div><p className="text-xs font-bold text-white">Focus for today</p><p className="text-xs text-slate-400">Follow up with 8 high-intent leads</p></div><ChevronRight className="ml-auto h-4 w-4 text-slate-500" /></div>
          </div>
        </div>
      </section>

      <section id="platform" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-300">Everything in rhythm</p><h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">A clearer operating system for relationships.</h2><p className="mt-4 text-slate-400">Every surface is designed to reduce handoffs, reveal what matters, and help your team act with confidence.</p></div><div className="mt-10 grid gap-4 md:grid-cols-3">{features.map(({icon: Icon,title,text}) => <div className="glass-card glass-card-hover rounded-2xl p-6" key={title}><div className="mb-6 grid h-11 w-11 place-items-center rounded-xl bg-cyan-300/10 text-cyan-300"><Icon className="h-5 w-5" /></div><h3 className="text-lg font-bold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{text}</p></div>)}</div></section>
      <section id="workflow" className="border-y border-white/5 bg-white/[.025]"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:px-10"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-300">Designed for momentum</p><h2 className="mt-3 text-3xl font-extrabold text-white">From signal to action in a few clicks.</h2></div><div className="grid gap-4 sm:grid-cols-3">{[['01','See the signal','Spot the accounts, leads, and cases that need attention.'],['02','Make the move','Update records and keep the team aligned.'],['03','Learn and repeat','Use clean reporting to improve the next cycle.']].map(([n,t,d]) => <div key={n}><p className="text-sm font-black text-cyan-300">{n}</p><h3 className="mt-3 font-bold text-white">{t}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{d}</p></div>)}</div></div></section>
      <section id="security" className="mx-auto max-w-7xl px-5 py-20 text-center sm:px-8 lg:px-10"><div className="mx-auto max-w-2xl"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-400/10 text-emerald-300"><CircleHelp className="h-5 w-5" /></div><h2 className="mt-5 text-3xl font-extrabold text-white">Ready to make every customer moment count?</h2><p className="mt-4 text-slate-400">Bring your team into one focused workspace and start with the view that matters most.</p><Link to="/register" className="mt-8 inline-flex items-center rounded-xl bg-white px-5 py-3.5 font-bold text-slate-900 hover:bg-cyan-50">Create your workspace <ArrowRight className="ml-2 h-4 w-4" /></Link></div></section>
    </main>
    <footer className="relative z-10 border-t border-white/5 px-5 py-6 text-center text-xs text-slate-500">Aethelgard CRM · Financial-grade relationship intelligence for modern teams</footer>
  </div>
);

export default Home;
