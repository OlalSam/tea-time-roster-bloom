
import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, isAdmin: false, isLoading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      checkAdminStatus(session?.user?.id);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      checkAdminStatus(session?.user?.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string | undefined) => {
    if (!userId) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await supabase
        .from('employees')
        .select('position')  // Using position instead of role
        .eq('id', userId)
        .single();
      
      // Check if position is 'admin' or 'manager'
      setIsAdmin(data?.position === 'admin' || data?.position === 'manager');
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
