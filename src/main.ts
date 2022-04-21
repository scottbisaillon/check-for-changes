import * as core from '@actions/core'
import minimatch from 'minimatch'
import path from 'path'
import simpleGit from 'simple-git'

const INPUT_FILES_GLOB = 'filesGlob'

const baseDir = path.join(process.cwd())
const git = simpleGit({baseDir})

interface ActionConfig {
  filesGlob: string
}

function getInputs(): ActionConfig {
  let filesGlob = core.getInput(INPUT_FILES_GLOB)
  if (filesGlob === '') filesGlob = '**'

  return {
    filesGlob
  }
}

function checkIfFilesChanged(files: string[], glob: string): boolean {
  return minimatch.match(files, glob).length > 0
}

async function run(): Promise<void> {
  core.debug(`running in ${baseDir}`)
  const config = getInputs()
  core.debug(`inputs: ${JSON.stringify(config)}`)
  const result = await git.tags()
  core.debug(`tags: ${JSON.stringify(result)}`)
  if (result.all.length < 0) {
    core.debug('no tags found, setting changes=true')
    core.setOutput('first_tag', true)
    core.setOutput('changes', true)
  } else {
    const previousTag = result.latest
    const diffResult = await git.diffSummary(`${previousTag}`)

    const files = diffResult.files.map(v => v.file)
    const changed = checkIfFilesChanged(files, config.filesGlob)
    core.debug(`setting changes=${changed}`)
    core.setOutput('changes', changed)
  }
}

run()
