
import { Project } from '../projects';
import { csProjects } from './cs-projects';
import { aiProjects } from './ai-projects';
import { webProjects } from './web-projects';
import { mobileProjects } from './mobile-projects';
import { iotProjects } from './iot-projects';

// تعديل المشاريع الإضافية لإضافة روابط حقيقية
export const additionalProjects: Project[] = [
  // تعديل المشاريع الموجودة لإضافة روابط حقيقية
  ...csProjects.map(project => ({
    ...project,
    pdfUrl: project.pdfUrl || 'https://africau.edu/images/default/sample.pdf',
    downloadUrl: project.downloadUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  })),
  ...aiProjects.map(project => ({
    ...project,
    pdfUrl: project.pdfUrl || 'https://africau.edu/images/default/sample.pdf',
    downloadUrl: project.downloadUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  })),
  ...webProjects.map(project => ({
    ...project,
    pdfUrl: project.pdfUrl || 'https://africau.edu/images/default/sample.pdf',
    downloadUrl: project.downloadUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  })),
  ...mobileProjects.map(project => ({
    ...project,
    pdfUrl: project.pdfUrl || 'https://africau.edu/images/default/sample.pdf',
    downloadUrl: project.downloadUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  })),
  ...iotProjects.map(project => ({
    ...project,
    pdfUrl: project.pdfUrl || 'https://africau.edu/images/default/sample.pdf',
    downloadUrl: project.downloadUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  }))
];
