
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

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
    <div className="flex justify-end space-x-4 space-x-reverse pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        إلغاء
      </Button>
      <Button
        type="submit"
        className="bg-archive-primary hover:bg-archive-primary/80"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <Loader2 className="h-4 w-4 ml-2 animate-spin" />
            {isEditMode ? 'جار حفظ التغييرات...' : 'جار إضافة المشروع...'}
          </span>
        ) : (
          isEditMode ? 'حفظ التغييرات' : 'إضافة المشروع'
        )}
      </Button>
    </div>
  );
};
