
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const ProjectDetailNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">المشروع غير موجود</h2>
        <p className="mb-6">عذراً، لم يتم العثور على المشروع المطلوب</p>
        <Button onClick={() => navigate('/projects')}>
          العودة إلى المشاريع
        </Button>
      </div>
    </div>
  );
};

export default ProjectDetailNotFound;
