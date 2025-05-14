
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Save, X } from 'lucide-react';

interface ProjectFormFooterProps {
  isSubmitting: boolean;
  isEditMode: boolean;
  onCancel: () => void;
}

export const ProjectFormFooter: React.FC<ProjectFormFooterProps> = ({
  isSubmitting,
  isEditMode,
  onCancel
}) => {
  return (
    <div className="flex justify-between pt-6 border-t mt-8">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        <X className="ml-2 h-4 w-4" />
        إلغاء
      </Button>
      
      <Button 
        type="submit"
        className="bg-archive-primary hover:bg-archive-primary/80"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            {isEditMode ? 'جاري التحديث...' : 'جاري الحفظ...'}
          </>
        ) : (
          <>
            <Save className="ml-2 h-4 w-4" />
            {isEditMode ? 'تحديث المشروع' : 'حفظ المشروع'}
          </>
        )}
      </Button>
    </div>
  );
};
