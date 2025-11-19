import { runTOIValidationTests } from './toi_validation.test.js';
import { runPromptBuildingTests } from './prompt_building.test.js';

async function run() {
  try {
    await runTOIValidationTests();
    console.log('✅ TOI validation tests passed');
    await runPromptBuildingTests();
    console.log('✅ Prompt building tests passed');
  } catch (error) {
    console.error('❌ Tests failed');
    console.error(error);
    process.exitCode = 1;
  }
}

run();
