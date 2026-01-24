import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/ui/Logo";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100">
      
      {/* --- NAVBAR (Fixed & Blur) --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          {/* Logo 1: The Cornerstone */}
          <Link href="/">
            <Logo />
          </Link>

          {/* Botones Derecha */}
          <div className="flex items-center gap-4">
            <Link 
              href="/auth/register" 
              className="hidden sm:block text-sm font-medium text-gray-600 hover:text-blue-600 transition"
            >
              Create account
            </Link>
            <Link
              href="/auth/login"
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition shadow-sm hover:shadow-md"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 px-4 text-center max-w-5xl mx-auto">
        {/* Badge "New Feature" */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wide mb-6 border border-blue-100">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          Now with AI Auto-Description
        </div>
        
        {/* Título Principal */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-gray-900 mb-6">
          Stay organized, close deals, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            & follow The Way.
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          No clutter, just powerful AI features that help real estate agents 
          stay organized and in sync. The definitive path to success.
        </p>

        {/* Botones CTA Hero */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/auth/register" 
            className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Get Started For Free
          </Link>
          <Link 
            href="#features" 
            className="w-full sm:w-auto px-8 py-4 text-lg font-semibold text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition border border-gray-200"
          >
            How it works
          </Link>
        </div>
      </section>

      {/* --- APP PREVIEW (MOCKUP) --- */}
      <section className="px-4 mb-24">
        <div className="max-w-6xl mx-auto p-2 bg-gray-100 rounded-2xl border border-gray-200 shadow-2xl">
           <div className="rounded-xl overflow-hidden bg-white border border-gray-200 aspect-video relative flex items-center justify-center bg-gray-50">
              {/* Asegúrate de tener la imagen en public/dashboard-preview.png */}
              <Image 
                src="/dashboard-preview.png" 
                alt="App Dashboard" 
                width={1200} 
                height={800} 
                className="w-full h-auto object-cover"
                priority
              />
           </div>
        </div>
      </section>

      {/* --- TECH STACK (Honest Authority) --- */}
      <section className="py-10 border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">
            Powered by world-class technology
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            
            {/* OpenAI (Intelligence) */}
            <div className="flex items-center gap-2">
               <span className="font-bold text-xl text-gray-700">OpenAI</span>
            </div>

            {/* Vercel (Speed) */}
            <div className="flex items-center gap-2">
               <svg className="h-6 w-6 text-black" viewBox="0 0 1155 1000" fill="currentColor"><path d="M577.344 0L1154.69 1000H0L577.344 0Z" /></svg>
               <span className="font-bold text-xl text-gray-700">Vercel</span>
            </div>

            {/* Supabase (Database) */}
            <div className="flex items-center gap-2">
               <svg className="h-6 w-6 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.75 5.76-2.5 13.8L4.25 8.45 10 2.69z"/></svg>
               <span className="font-bold text-xl text-gray-700">Supabase</span>
            </div>

            {/* Next.js (Framework) */}
            <div className="flex items-center gap-2">
               <span className="font-bold text-xl text-gray-700">Next.js</span>
            </div>

          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Everything you need.</h2>
          <p className="text-xl text-gray-500">Built specifically for high-performance agents.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition group">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">AI Descriptions</h3>
            <p className="text-gray-500 leading-relaxed">
              Upload photos and details, and our AI writes persuasive listing copy in seconds.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition group">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Pipeline Kanban</h3>
            <p className="text-gray-500 leading-relaxed">
              Drag and drop properties from "New Lead" to "Sold" with our intuitive Kanban board.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition group">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Fast</h3>
            <p className="text-gray-500 leading-relaxed">
              Your data is encrypted, backed up, and loads instantly from anywhere.
            </p>
          </div>
        </div>
      </section>

      {/* --- BIG CTA SECTION --- */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-blue-600 rounded-3xl p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
          {/* Decorative Circle */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
          
          <div className="relative z-10 mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to find The Way?</h2>
            <p className="text-blue-100 text-lg max-w-md">Start your free trial today and close more deals.</p>
          </div>
          <div className="relative z-10">
            <Link 
              href="/auth/register" 
              className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-50 transition shadow-lg"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <span className="text-xl font-bold text-gray-900">TheWay<span className="text-blue-600">CRM</span></span>
            <p className="mt-4 text-gray-500 max-w-xs text-sm">
              The AI-powered CRM for modern real estate professionals. Simplifying the path to your next sale.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-2 text-gray-500 text-sm">
              <li><Link href="#" className="hover:text-blue-600">Features</Link></li>
              <li><Link href="#" className="hover:text-blue-600">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2 text-gray-500 text-sm">
              <li><Link href="#" className="hover:text-blue-600">About</Link></li>
              <li><Link href="#" className="hover:text-blue-600">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-400 text-sm border-t border-gray-200 pt-8">
          © 2026 TheWay CRM. All rights reserved.
        </div>
      </footer>
    </div>
  );
}