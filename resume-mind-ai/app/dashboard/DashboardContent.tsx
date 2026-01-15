'use client';

import { User } from '@supabase/supabase-js';
import Image from 'next/image';
import { createClient } from '@/app/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface DashboardContentProps {
  user: User;
}

export default function DashboardContent({ user }: DashboardContentProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-background-dark">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-lg">hub</span>
              </div>
              <span className="font-semibold text-white">ResumeMindAI</span>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {user.user_metadata?.avatar_url && (
                  <Image
                    src={user.user_metadata.avatar_url}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <span className="text-sm text-slate-300">
                  {user.user_metadata?.full_name ?? user.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-800"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to Your Dashboard</h1>
          <p className="text-slate-400 text-lg mb-8">
            You are signed in as <span className="text-primary">{user.email}</span>
          </p>

          {/* Placeholder Card */}
          <div className="glass-card p-8 rounded-2xl max-w-md mx-auto">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-primary text-3xl">construction</span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Dashboard Coming Soon</h2>
            <p className="text-slate-400">
              Your AI-powered career intelligence features are being built. Check back soon!
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
