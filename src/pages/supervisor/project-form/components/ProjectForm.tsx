
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormHeader } from './FormHeader';
import { BasicInfoFields } from './BasicInfoFields';
import { ContentFields } from './ContentFields';
import { ProjectFormFooter } from './ProjectFormFooter';
import type { UseFormReturn } from 'react-hook-form';
import type { ProjectFormValues } from '../schema/projectSchema';

interface ProjectFormProps {
  form: UseFormReturn<ProjectFormValues>;
  onSubmit: (values: ProjectFormValues) => Promise<void>;
  isEditMode: boolean;
  isSubmitting: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ 
  form, 
  onSubmit, 
  isEditMode, 
  isSubmitting 
}) => {
  const navigate = useNavigate();
  
  return (
    <>
      <FormHeader isEditMode={isEditMode} />
      
      <Card className="border-archive-secondary/20">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <BasicInfoFields form={form} />
              <ContentFields form={form} />
              <ProjectFormFooter 
                isSubmitting={isSubmitting}
                isEditMode={isEditMode}
                onCancel={() => navigate('/supervisor/projects')}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};
