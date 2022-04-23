<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# Github Action - check-for-changes

This action checks if there have been any changes in the specified files since the last tag has been pushed.

The current checked out branch will always be compared to the last tag pushed. If the last tag pushed does not follow [semantic versioning](https://semver.org/), the next matching tag will be used (tags are sorted according to semantic versioning).

Example:
Given the following tags, `v1.0.2` will be used.
```
tags: {"all":["non-semantic-tag","v1.0.0","v1.0.1","v1.0.2"],"latest":"v1.0.2"}
```

## Motivation

Many jobs run on a schedule to automate things such as releases, tests, etc. If no changes have occurred since the last time the job has been run, it can slowly eat up build time and run jobs unnecessarily.

Using this action in the first job of a workflow can gate whether the rest of the jobs need to run or not.

## Action Inputs

- `filesGlob` - glob pattern for which files to compare
  - Default: `**` (matches all files in the repo)
  - See npm package [minimatch](https://github.com/isaacs/minimatch) for patterns


## Action Outputs
- `changes` - set to `'true'` if any files matching `filesGlob` have changed
- `first_tag` - set to `'true'` if no tags are found

## Usage

This is an example of a job that runs nightly at 12:15. The first job `check` determines if any files under the directory `lib/` have been changed and sets an output accordingly. The next job `build`, only runs if the output is equal to `true`.

```yaml
name: nightly build

on:
  workflow_dispatch:
  schedule:
    - cron: '15 12 * * *'

env:
  GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}

jobs:
  check:
    runs-on: ubuntu-latest
    outputs:
      status: ${{ steps.changes.outputs.changes }}
    steps:
      - uses: actions/checkout@v2
      - id: changes
        with:
          glob: lib/**
        uses: scottbisaillon/check-for-changes@v1

  build:
    needs: check
    if: needs.check.outputs.status == 'true'
    runs-on: ubuntu-latest
    steps: 
      ... rest of the job
```













