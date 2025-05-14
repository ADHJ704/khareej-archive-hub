
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isTrainee: boolean;
  isSupervisor: boolean;
};

// إنشاء سياق الترميز
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isTrainee: false,
  isSupervisor: false,
});

// مزود سياق الترميز (AuthProvider)
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTrainee, setIsTrainee] = useState(false);
  const [isSupervisor, setIsSupervisor] = useState(false);

  useEffect(() => {
    // تسجيل مستمع لتغيرات حالة المصادقة
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        // إعادة ضبط الأدوار عند تغيير حالة المستخدم
        if (!session?.user) {
          setIsTrainee(false);
          setIsSupervisor(false);
          setLoading(false);
        } else {
          // التحقق من دور المستخدم إذا كان متصلاً
          checkUserRole(session.user.id);
          
          // التحقق أيضًا من البيانات الوصفية للمستخدم (التي قد تحتوي على الدور)
          if (session.user.user_metadata?.role === 'supervisor' || 
              session.user.app_metadata?.role === 'supervisor') {
            setIsSupervisor(true);
          } else if (session.user.user_metadata?.role === 'trainee' || 
                    session.user.app_metadata?.role === 'trainee') {
            setIsTrainee(true);
          }
        }
      }
    );

    // التحقق من الجلسة الحالية عند التحميل الأولي
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.email || "No session");
      setSession(session);
      setUser(session?.user ?? null);
      
      // التحقق من دور المستخدم عند التحميل الأولي
      if (session?.user) {
        checkUserRole(session.user.id);
        
        // التحقق من البيانات الوصفية للمستخدم
        if (session.user.user_metadata?.role === 'supervisor' || 
            session.user.app_metadata?.role === 'supervisor') {
          setIsSupervisor(true);
        } else if (session.user.user_metadata?.role === 'trainee' || 
                  session.user.app_metadata?.role === 'trainee') {
          setIsTrainee(true);
        }
      }
      setLoading(false);
    });

    // تنظيف المستمع عند إزالة المكون
    return () => subscription.unsubscribe();
  }, []);

  // دالة للتحقق من دور المستخدم
  const checkUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Error checking user role:", error);
        return;
      }
      
      if (data) {
        setIsTrainee(data.role === 'trainee');
        setIsSupervisor(data.role === 'supervisor');
      }
    } catch (error) {
      console.error("Failed to check user role:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isTrainee, isSupervisor }}>
      {children}
    </AuthContext.Provider>
  );
};

// خطاف (hook) للوصول إلى سياق المصادقة
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
