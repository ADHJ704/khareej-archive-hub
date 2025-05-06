
import React from 'react';
import Header from '@/components/Header';
import { ProjectForm } from './components/ProjectForm';
import LoadingSpinner from '../projects/components/LoadingSpinner';
import { useParams } from 'react-router-dom';
import { useProjectForm } from './hooks/useProjectForm';

const SupervisorProjectForm = () => {
  const { projectId } = useParams();
  const isEditMode = !!projectId;
  const { form, isSubmitting, loadingProject, onSubmit } = useProjectForm(isEditMode, projectId);
  
  if (loadingProject) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-background">
        <Header />
        <main className="container mx-auto px-4 py-10 flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-archive-primary mb-4"></div>
            <p className="text-archive-dark dark:text-white">جاري تحميل بيانات المشروع...</p>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-background">
      <Header />
      <main className="container mx-auto px-4 py-10 flex-grow">
        <ProjectForm 
          form={form} 
          onSubmit={onSubmit} 
          isEditMode={isEditMode} 
          isSubmitting={isSubmitting} 
        />
      </main>
    </div>
  );
};

export default SupervisorProjectForm;
