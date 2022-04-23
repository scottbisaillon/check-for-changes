import * as core from '@actions/core';
import minimatch from 'minimatch';
import path from 'path';
import simpleGit from 'simple-git';
import getInputs from './get-inputs';

const baseDir = path.join(process.cwd());
const git = simpleGit({baseDir});

export default async function checkIfFilesChanged(): Promise<void> {
  core.debug(`running in ${baseDir}`);
  const config = getInputs();
  core.debug(`inputs: ${JSON.stringify(config)}`);
  const result = await git.tags();
  core.debug(`tags: ${JSON.stringify(result)}`);
  if (result.all.length < 0) {
    core.debug('no tags found, setting changes=true');
    core.setOutput('first_tag', true);
    core.setOutput('changes', true);
  } else {
    const previousTag = result.latest;
    const diffResult = await git.diffSummary(`${previousTag}`);

    const files = diffResult.files.map(v => v.file);
    const changed = minimatch.match(files, config.filesGlob).length > 0;
    core.debug(`setting changes=${changed}`);
    core.setOutput('changes', changed);
  }
}
