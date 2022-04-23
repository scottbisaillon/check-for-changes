import checkIfFilesChanged from './lib';

async function run(): Promise<void> {
  await checkIfFilesChanged();
}

run();
