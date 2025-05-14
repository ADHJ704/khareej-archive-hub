
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RequireSupervisorProps {
  children: React.ReactNode;
}

export const RequireSupervisor: React.FC<RequireSupervisorProps> = ({ children }) => {
  const { user, loading, isSupervisor } = useAuth();

  // أثناء التحقق من حالة المصادقة، نعرض شاشة التحميل
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-archive-primary"></div>
      </div>
    );
  }

  // إذا لم يكن المستخدم مسجل الدخول، توجيه إلى صفحة تسجيل دخول المشرف
  if (!user) {
    return <Navigate to="/supervisor-login" />;
  }

  // إذا كان المستخدم مسجل الدخول ولكنه ليس مشرفًا، توجيه إلى الصفحة الرئيسية
  if (!isSupervisor) {
    return <Navigate to="/" />;
  }

  // إذا كان المستخدم مشرفًا، عرض المحتوى المطلوب
  return <>{children}</>;
};

export default RequireSupervisor;
