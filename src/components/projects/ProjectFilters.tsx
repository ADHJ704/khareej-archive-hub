
import React from 'react';
import { Button } from "@/components/ui/button";
import CategoryFilter from '@/components/CategoryFilter';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectFiltersProps {
  selectedCategories: string[];
  onCategoryChange: (categoryId: string) => void;
  departmentFilter: string;
  onDepartmentChange: (value: string) => void;
  categories: Array<{ id: string; name: string; icon?: string }>;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

const DEPARTMENTS = [
  "علوم الحاسب",
  "نظم المعلومات",
  "هندسة الحاسب",
  "الذكاء الاصطناعي",
  "أمن المعلومات",
  "شبكات الحاسب",
  "تطبيقات الجوال",
  "تطوير الويب",
  "دعم فني حاسب آلي",
  "تقنية شبكات",
  "برمجة تطبيقات",
  "إنترنت الأشياء",
  "إدارة تقنية"
];

const ProjectFilters = ({
  selectedCategories,
  onCategoryChange,
  departmentFilter,
  onDepartmentChange,
  categories,
  hasActiveFilters,
  onClearFilters
}: ProjectFiltersProps) => {
  return (
    <div className="p-4 bg-white dark:bg-card rounded-lg shadow-sm">
      <h3 className="font-medium text-lg mb-4">تصفية النتائج</h3>
      
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          التصنيفات الرئيسية
        </h4>
        <CategoryFilter 
          categories={categories} 
          selectedCategories={selectedCategories}
          onCategoryChange={onCategoryChange}
        />
      </div>
      
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          التخصص
        </h4>
        <Select
          value={departmentFilter}
          onValueChange={onDepartmentChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="اختر التخصص" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">الكل</SelectItem>
            {DEPARTMENTS.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {hasActiveFilters && (
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={onClearFilters}
        >
          مسح التصفية
        </Button>
      )}
    </div>
  );
};

export default ProjectFilters;
