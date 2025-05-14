
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface DeleteProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectTitle: string;
  isDeleting: boolean;
  onConfirmDelete: () => void;
}

const DeleteProjectDialog = ({
  open,
  onOpenChange,
  projectTitle,
  isDeleting,
  onConfirmDelete,
}: DeleteProjectDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>هل تريد حذف هذا المشروع؟</DialogTitle>
          <DialogDescription>
            أنت على وشك حذف مشروع "{projectTitle}". هذا الإجراء لا يمكن التراجع عنه.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:space-x-0 rtl:space-x-reverse">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            إلغاء
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جاري الحذف...
              </>
            ) : "حذف المشروع"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProjectDialog;
