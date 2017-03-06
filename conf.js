//Brad Stouffer 'QA Practical' Automation Tests
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['todos_spec.js'],
  capabilities: {
  	browserName: 'chrome'
  }
};