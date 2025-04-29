
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

interface ProjectDetailErrorStateProps {
  message?: string;
}

const ProjectDetailErrorState = ({ message = "لم نتمكن من تحميل بيانات المشروع، يرجى المحاولة مرة أخرى" }: ProjectDetailErrorStateProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">حدث خطأ</h2>
        <p className="mb-6">{message}</p>
        <Button onClick={() => navigate('/projects')}>
          العودة إلى المشاريع
        </Button>
      </div>
    </div>
  );
};

export default ProjectDetailErrorState;
