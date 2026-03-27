
"use client"

import Link from 'next/link';
import { useAuth, useUser } from '@/firebase';
import { signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Shield, LogIn, LogOut, History, User as UserIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Navbar() {
  const auth = useAuth();
  const { user } = useUser();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass-morphism border-b border-white/10 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="bg-primary p-2 rounded-lg group-hover:scale-110 transition-transform">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-headline font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          VeriLens
        </span>
      </Link>

      <div className="flex items-center gap-6">
        <Link href="/history" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
          <History className="w-4 h-4" />
          History
        </Link>
        
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border border-white/20">
                  <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                  <AvatarFallback><UserIcon /></AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-morphism text-foreground border-white/10">
              <div className="px-2 py-1.5 font-medium border-b border-white/10 mb-1">
                {user.displayName}
              </div>
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={handleLogin} className="flex items-center gap-2">
            <LogIn className="w-4 h-4" />
            Login
          </Button>
        )}
      </div>
    </nav>
  );
}
