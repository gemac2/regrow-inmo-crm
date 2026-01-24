import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* --- NAVBAR --- */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="text-2xl font-bold tracking-tight text-blue-600">
          TheWay<span className="text-gray-900">CRM</span>
        </div>

        {/* Botones Derecha */}
        <div className="flex items-center gap-4">
          <Link 
            href="/auth/register" 
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition"
          >
            Create account
          </Link>
          <Link
            href="/auth/login"
            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="flex flex-col items-center justify-center px-4 mt-20 text-center max-w-4xl mx-auto">
        
        {/* Título Principal */}
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-gray-900">
          Stay organized, close deals, <br />
          <span className="text-blue-600">& follow The Way.</span>
        </h1>

        {/* Subtítulo */}
        <p className="mt-6 text-xl text-gray-500 max-w-2xl">
          No clutter, just powerful AI features that help real estate agents 
          stay organized and in sync. The definitive path to success.
        </p>

        {/* Botón Principal (CTA) */}
        <div className="mt-10">
          <Link
            href="/auth/login"
            className="px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Get Started For Free
          </Link>
        </div>

        {/* --- IMAGEN DEL DASHBOARD (MOCKUP) --- */}
        {/* Aquí simulamos la imagen de abajo de Eboardo */}
        <div className="mt-20 p-2 bg-gray-100 rounded-2xl border border-gray-200 shadow-2xl">
           <div className="rounded-xl overflow-hidden bg-white">
              <Image 
                src="/dashboard-preview.png" 
                alt="App Dashboard" 
                width={1200} 
                height={800} 
                className="w-full h-auto"
              />
           </div>
        </div>

      </main>

      {/* --- FOOTER SENCILLO --- */}
      <footer className="mt-32 py-10 text-center text-gray-400 text-sm">
        <p>© 2026 TheWay CRM. All rights reserved.</p>
      </footer>
    </div>
  );
}