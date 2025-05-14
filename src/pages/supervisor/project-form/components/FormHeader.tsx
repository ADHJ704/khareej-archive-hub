
import React from 'react';

interface FormHeaderProps {
  isEditMode: boolean;
}

export const FormHeader: React.FC<FormHeaderProps> = ({ isEditMode }) => {
  return (
    <div className="mb-6 text-right">
      <h1 className="text-3xl font-bold text-archive-dark dark:text-white">
        {isEditMode ? "تعديل مشروع" : "إضافة مشروع جديد"}
      </h1>
      <p className="text-muted-foreground mt-2">
        {isEditMode 
          ? "قم بتعديل بيانات المشروع الحالي"
          : "قم بإدخال بيانات المشروع الجديد لإضافته إلى أرشيف المشاريع"
        }
      </p>
    </div>
  );
};
