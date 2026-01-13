import type { Metadata } from 'next';
import KnowledgeGraphBackground from '@/app/components/auth/KnowledgeGraphBackground';

export const metadata: Metadata = {
  title: 'Login - ResumeMindAI',
  description: 'Sign in to your ResumeMindAI account to access AI-powered career intelligence and profile mapping.',
};

export default function LoginPage() {
  return (
    <main className="text-slate-200 min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Knowledge Graph Background */}
      <KnowledgeGraphBackground />

      {/* Login Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo and Branding */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 mb-6 border border-white/10">
            <span className="material-symbols-outlined text-4xl text-white">hub</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            ResumeMindAI
          </h1>
          <p className="text-sm text-slate-400 text-center max-w-xs">
            AI-powered career intelligence and profile mapping.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/50 backdrop-blur-2xl border border-slate-700/50 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-10">
          <div className="space-y-8">
            {/* Welcome Text */}
            <div className="text-center">
              <h2 className="text-xl font-medium text-white">Welcome Back</h2>
              <p className="text-sm text-slate-400 mt-2">Sign in to continue to your dashboard</p>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              className="group relative w-full flex justify-center items-center gap-4 py-4 px-6 rounded-xl text-slate-900 font-semibold bg-slate-100 hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 shadow-lg shadow-white/5 active:scale-95"
            >
              {/* Google Logo SVG */}
              <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-700/50" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-slate-900/50 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                  Encrypted Gateway
                </span>
              </div>
            </div>

            {/* Legal Text */}
            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
              By accessing the platform, you acknowledge and agree to our{' '}
              <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-12 flex justify-center items-center gap-6 text-xs font-medium text-slate-500 uppercase tracking-wider">
          <a href="#" className="hover:text-white transition-colors duration-200">
            Legal
          </a>
          <div className="w-1 h-1 bg-slate-700 rounded-full" />
          <a href="#" className="hover:text-white transition-colors duration-200">
            Status
          </a>
          <div className="w-1 h-1 bg-slate-700 rounded-full" />
          <a href="#" className="hover:text-white transition-colors duration-200">
            Support
          </a>
        </div>
      </div>
    </main>
  );
}
