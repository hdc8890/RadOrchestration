// installer/lib/prompts/ui-install.js

import { confirm, input } from '@inquirer/prompts';
import { INQUIRER_THEME } from '../theme.js';
import path from 'node:path';

/**
 * Runs the "Dashboard UI" prompt section: UI confirm and optional directory input.
 * @param {string} workspaceDir - Absolute path to the workspace directory (for default uiDir)
 * @returns {Promise<{ installUi: boolean, uiDir?: string }>}
 */
export async function promptUiInstall(workspaceDir) {
  const installUi = await confirm({
    message: 'Install the monitoring dashboard UI?',
    theme: INQUIRER_THEME,
    default: true,
  });

  if (!installUi) {
    return { installUi: false };
  }

  const rawDir = await input({
    message: 'Dashboard installation directory',
    theme: INQUIRER_THEME,
    default: path.join(workspaceDir, 'ui'),
    validate: (value) => {
      if (value.trim() === '') {
        return 'Please enter a valid directory path.';
      }
      return true;
    },
  });

  return { installUi: true, uiDir: path.resolve(rawDir) };
}
