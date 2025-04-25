
import { Project } from '../projects';
import { csProjects } from './cs-projects';
import { aiProjects } from './ai-projects';
import { webProjects } from './web-projects';
import { mobileProjects } from './mobile-projects';
import { iotProjects } from './iot-projects';

export const additionalProjects: Project[] = [
  ...csProjects,
  ...aiProjects,
  ...webProjects,
  ...mobileProjects,
  ...iotProjects
];
