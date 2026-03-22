// installer/lib/prompts/project-storage.js

import { input, select } from '@inquirer/prompts';
import { INQUIRER_THEME } from '../theme.js';
import { normalizePath } from '../path-utils.js';

/**
 * Runs the "Project Storage" prompt section.
 * @returns {Promise<{ projectsBasePath: string, projectsNaming: 'SCREAMING_CASE'|'lowercase'|'numbered' }>}
 */
export async function promptProjectStorage() {
  const projectsBasePath = await input({
    message: 'Project storage path',
    theme: INQUIRER_THEME,
    default: 'orchestration-projects',
  });

  const projectsNaming = await select({
    message: 'Project folder naming convention',
    theme: INQUIRER_THEME,
    default: 'SCREAMING_CASE',
    choices: [
      { name: 'SCREAMING_CASE', value: 'SCREAMING_CASE' },
      { name: 'lowercase',      value: 'lowercase' },
      { name: 'numbered',       value: 'numbered' },
    ],
  });

  return { projectsBasePath: normalizePath(projectsBasePath), projectsNaming };
}
