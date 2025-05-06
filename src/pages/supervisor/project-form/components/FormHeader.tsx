
import React from 'react';

interface FormHeaderProps {
  isEditMode: boolean;
}

export const FormHeader: React.FC<FormHeaderProps> = ({ isEditMode }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-archive-dark dark:text-white text-right">
        {isEditMode ? 'تعديل المشروع' : 'إضافة مشروع جديد'}
      </h1>
      <p className="text-muted-foreground mt-2 text-right">
        {isEditMode 
          ? 'قم بتعديل بيانات المشروع الموجود' 
          : 'أدخل بيانات المشروع الجديد لإضافته إلى الأرشيف'}
      </p>
    </div>
  );
};
