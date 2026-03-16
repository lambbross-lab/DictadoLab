import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  plan: 'free' | 'pro';
  dictados_usados: number;
  dictados_usados_hoy?: number;
  ultimo_uso_dia?: string;
  ultimo_reset_mes?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isPro: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  incrementUsage: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const isPro = profile?.plan === 'pro';

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
        return;
      }

      if (data) {
        const profileData = data as Profile;
        const today = new Date().toISOString().split('T')[0];
        const currentMonthYear = today.substring(0, 7); // YYYY-MM
        
        let needsUpdate = false;
        const updatePayload: any = {};

        // Reset monthly count if it's a new month
        const lastResetMonth = profileData.ultimo_reset_mes?.substring(0, 7);
        if (!profileData.ultimo_reset_mes || lastResetMonth !== currentMonthYear) {
          profileData.dictados_usados = 0;
          profileData.ultimo_reset_mes = today;
          updatePayload.dictados_usados = 0;
          updatePayload.ultimo_reset_mes = today;
          needsUpdate = true;
        }
        
        // Reset daily count if it's a new day
        if (profileData.ultimo_uso_dia !== today) {
          profileData.dictados_usados_hoy = 0;
          profileData.ultimo_uso_dia = today;
          updatePayload.dictados_usados_hoy = 0;
          updatePayload.ultimo_uso_dia = today;
          needsUpdate = true;
        }

        if (needsUpdate) {
          // Silently update in background
          supabase.from('profiles').update(updatePayload).eq('id', userId).then(({ error }) => {
            if (error) console.error('Error resetting usage counters:', error);
          });
        }
        
        setProfile(profileData);
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const currentUser = session?.user ?? null;
    if (currentUser) {
      await fetchProfile(currentUser.id);
    }
  };

  const incrementUsage = async () => {
    if (!user || !profile) {
      console.log('incrementUsage: No user or profile found', { user: !!user, profile: !!profile });
      return;
    }

    console.log('incrementUsage: Authenticated User ID:', user.id);
    const today = new Date().toISOString().split('T')[0];
    const newMonthlyCount = (profile.dictados_usados || 0) + 1;
    const newDailyCount = (profile.dictados_usados_hoy || 0) + 1;

    console.log('incrementUsage: Before update runs', { 
      currentMonthly: profile.dictados_usados, 
      currentDaily: profile.dictados_usados_hoy,
      newMonthly: newMonthlyCount,
      newDaily: newDailyCount
    });

    const response = await supabase
      .from('profiles')
      .update({
        dictados_usados: newMonthlyCount,
        dictados_usados_hoy: newDailyCount,
        ultimo_uso_dia: today
      })
      .eq('id', user.id);

    console.log('incrementUsage: Supabase update response:', response);

    if (response.error) {
      console.error('incrementUsage: Supabase error:', response.error);
    } else {
      // Use functional update to ensure we have the latest state and trigger re-render
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          dictados_usados: newMonthlyCount,
          dictados_usados_hoy: newDailyCount,
          ultimo_uso_dia: today
        };
      });
    }
  };

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // When profile is loaded, we can stop loading
  useEffect(() => {
    if (user && profile) {
      setLoading(false);
    } else if (!user) {
      setLoading(false);
    }
  }, [user, profile]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, isPro, signOut, refreshProfile, incrementUsage }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
