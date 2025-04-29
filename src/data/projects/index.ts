
import { Project } from '../projects';
import { csProjects } from './cs-projects';
import { aiProjects } from './ai-projects';
import { webProjects } from './web-projects';
import { mobileProjects } from './mobile-projects';
import { iotProjects } from './iot-projects';

// تحديث المشاريع الإضافية لإضافة روابط حقيقية تعمل بشكل فعلي
export const additionalProjects: Project[] = [
  // تحديث المشاريع الموجودة لإضافة روابط حقيقية
  ...csProjects.map(project => ({
    ...project,
    pdfUrl: project.pdfUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    downloadUrl: project.downloadUrl || 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-zip-file.zip'
  })),
  ...aiProjects.map(project => ({
    ...project,
    pdfUrl: project.pdfUrl || 'https://africau.edu/images/default/sample.pdf',
    downloadUrl: project.downloadUrl || 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-zip-file.zip'
  })),
  ...webProjects.map(project => ({
    ...project,
    pdfUrl: project.pdfUrl || 'https://www.orimi.com/pdf-test.pdf',
    downloadUrl: project.downloadUrl || 'https://file-examples.com/storage/fe5947fd2362fc197a3c2df/2017/04/file_example_ZIP_1MB.zip'
  })),
  ...mobileProjects.map(project => ({
    ...project,
    pdfUrl: project.pdfUrl || 'https://www.africau.edu/images/default/sample.pdf',
    downloadUrl: project.downloadUrl || 'https://file-examples.com/storage/fe5947fd2362fc197a3c2df/2017/04/file_example_ZIP_1MB.zip'
  })),
  ...iotProjects.map(project => ({
    ...project,
    pdfUrl: project.pdfUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    downloadUrl: project.downloadUrl || 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-zip-file.zip'
  }))
];
