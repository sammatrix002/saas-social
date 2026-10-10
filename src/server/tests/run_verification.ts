import { runContractTestSuite } from './api_verification.ts';

async function main() {
  console.log('----------------------------------------------------');
  console.log('WhatsOmni v3.0 Backend Architecture & QA Verification');
  console.log('----------------------------------------------------');
  const summary = await runContractTestSuite();

  for (const r of summary.results) {
    const icon = r.passed ? '✓' : '✗';
    console.log(`[${icon}] ${r.suite} -> ${r.name}`);
    if (!r.passed && r.details) {
      console.log(`    Detail: ${r.details}`);
    }
  }

  console.log('----------------------------------------------------');
  console.log(`Total: ${summary.results.length} | Passed: ${summary.results.filter((r) => r.passed).length} | Failed: ${summary.results.filter((r) => !r.passed).length}`);
  console.log(`Overall Result: ${summary.passed ? 'PASSED' : 'FAILED'}`);
  console.log('----------------------------------------------------');

  if (!summary.passed) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
