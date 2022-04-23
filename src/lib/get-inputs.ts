import * as core from '@actions/core';

const INPUT_FILES_GLOB = 'filesGlob';


interface ActionConfig {
    filesGlob: string;
}

export default function getInputs(): ActionConfig {
    let filesGlob = core.getInput(INPUT_FILES_GLOB);
    if (filesGlob === undefined || filesGlob === '') filesGlob = '**';

    return {
        filesGlob
    };
}