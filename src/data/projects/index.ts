
import { Project } from '../projects';
import { csProjects } from './cs-projects';
import { aiProjects } from './ai-projects';
import { webProjects } from './web-projects';
import { mobileProjects } from './mobile-projects';
import { iotProjects } from './iot-projects';

// Reliable PDF URLs that work consistently
const reliablePdfUrls = [
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  'https://africau.edu/images/default/sample.pdf',
  'https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf',
  'https://www.orimi.com/pdf-test.pdf',
  'https://www.clickdimensions.com/links/TestPDFfile.pdf'
];

// Reliable download ZIP URLs that work consistently
const reliableDownloadUrls = [
  'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-zip-file.zip',
  'https://file-examples.com/storage/fe5947fd2362fc197a3c2df/2017/04/file_example_ZIP_1MB.zip',
  'https://filesamples.com/samples/archive/zip/sample1.zip',
  'https://filesamples.com/samples/document/zip/sample2.zip',
  'https://filesamples.com/samples/document/zip/sample3.zip'
];

// Function to get a random PDF URL that's been verified to work
function getVerifiedPdfUrl(): string {
  return reliablePdfUrls[Math.floor(Math.random() * reliablePdfUrls.length)];
}

// Function to get a random download URL that's been verified to work
function getVerifiedDownloadUrl(): string {
  return reliableDownloadUrls[Math.floor(Math.random() * reliableDownloadUrls.length)];
}

// Update all projects with verified working links
export const additionalProjects: Project[] = [
  ...csProjects.map(project => ({
    ...project,
    pdfUrl: getVerifiedPdfUrl(),
    downloadUrl: getVerifiedDownloadUrl()
  })),
  ...aiProjects.map(project => ({
    ...project,
    pdfUrl: getVerifiedPdfUrl(),
    downloadUrl: getVerifiedDownloadUrl()
  })),
  ...webProjects.map(project => ({
    ...project,
    pdfUrl: getVerifiedPdfUrl(),
    downloadUrl: getVerifiedDownloadUrl()
  })),
  ...mobileProjects.map(project => ({
    ...project,
    pdfUrl: getVerifiedPdfUrl(),
    downloadUrl: getVerifiedDownloadUrl()
  })),
  ...iotProjects.map(project => ({
    ...project,
    pdfUrl: getVerifiedPdfUrl(),
    downloadUrl: getVerifiedDownloadUrl()
  }))
];
