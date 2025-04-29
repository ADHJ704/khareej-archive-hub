
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, FileText, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { RequireAuth } from '@/components/RequireAuth';

interface ProfileData {
  first_name: string;
  last_name: string;
}

const TraineeDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      
      try {
        // Get user metadata from auth user
        const { data, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Error fetching user data:', error);
          return;
        }
        
        // Extract first_name and last_name from user metadata
        const metadata = data.user.user_metadata as ProfileData;
        
        if (metadata) {
          setProfileData({
            first_name: metadata.first_name || '',
            last_name: metadata.last_name || ''
          });
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);
  
  const handleSuggestProject = () => {
    navigate('/suggest-project');
    toast({
      title: "مشروع جديد",
      description: "انتقل إلى صفحة اقتراح المشروع الجديد"
    });
  };
  
  return (
    <RequireAuth>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="max-w-5xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <p className="text-gray-600 dark:text-gray-300">جاري تحميل البيانات...</p>
              </div>
            ) : (
              <>
                <div className="mb-8 text-right">
                  <h1 className="text-3xl font-bold text-archive-dark dark:text-white mb-2">
                    {profileData ? (
                      <span>مرحباً {profileData.first_name} {profileData.last_name}</span>
                    ) : (
                      <span>مرحباً بك</span>
                    )}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    مرحباً بك في لوحة تحكم المتدرب. يمكنك إدارة مشاريعك واقتراح مشاريع جديدة من هنا.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-archive-primary/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-right text-archive-dark dark:text-white">
                        اقتراح مشروع
                      </CardTitle>
                      <CardDescription className="text-right">
                        اقترح مشروعاً جديداً للأرشيف
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full bg-archive-primary hover:bg-archive-dark"
                        onClick={handleSuggestProject}
                      >
                        <PlusCircle className="ml-2 h-5 w-5" />
                        اقترح مشروعاً جديداً
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-archive-primary/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-right text-archive-dark dark:text-white">
                        استعراض المشاريع
                      </CardTitle>
                      <CardDescription className="text-right">
                        تصفح مشاريع الأرشيف
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full"
                        variant="outline"
                        onClick={() => navigate('/projects')}
                      >
                        <BookOpen className="ml-2 h-5 w-5" />
                        استعراض المشاريع
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </RequireAuth>
  );
};

export default TraineeDashboard;
