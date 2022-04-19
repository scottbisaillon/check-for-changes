import * as core from '@actions/core'
import path from 'path'
import simpleGit from 'simple-git'

const baseDir = path.join(process.cwd())
const git = simpleGit({baseDir})

async function run(): Promise<void> {
  git.tags((err, tags) => {
    core.info(tags.all.join(', '))
  })
}

run()
