
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ManageProjectsHeaderProps {
  projectCount: number;
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ManageProjectsHeader = ({
  projectCount,
  isLoading,
  searchQuery,
  onSearchChange
}: ManageProjectsHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-archive-dark dark:text-white text-right">
            إدارة المشاريع
          </h1>
          <p className="text-muted-foreground mt-1 text-right">
            يمكنك عرض وحذف المشاريع من هنا
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="w-full sm:w-auto"
                >
                  <ArrowRight className="h-4 w-4 ml-1" />
                  العودة
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>العودة للصفحة السابقة</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  onClick={() => navigate('/supervisor/add-project')}
                  className="bg-archive-primary hover:bg-archive-primary/90 w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 ml-1" />
                  إضافة مشروع جديد
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>إضافة مشروع جديد للأرشيف</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-right">قائمة المشاريع</CardTitle>
            <CardDescription className="text-right">
              {isLoading 
                ? 'جاري تحميل المشاريع...' 
                : `إجمالي المشاريع: ${projectCount}`
              }
            </CardDescription>
          </div>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في المشاريع..."
              value={searchQuery}
              onChange={onSearchChange}
              className="pr-10 text-right w-full"
            />
          </div>
        </div>
      </CardHeader>
    </>
  );
};

export default ManageProjectsHeader;
