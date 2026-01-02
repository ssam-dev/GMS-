#!/usr/bin/env node

/**
 * Pre-Deployment Setup Script
 * Verifies everything is ready for Railway deployment
 */

const fs = require('fs');
const path = require('path');

console.log('\n🚀 GMS Pre-Deployment Checklist\n');

const checks = [
  {
    name: 'Backend package.json',
    path: 'backend/package.json',
    type: 'file'
  },
  {
    name: 'Frontend package.json',
    path: 'frontend/package.json',
    type: 'file'
  },
  {
    name: 'Backend node_modules',
    path: 'backend/node_modules',
    type: 'directory'
  },
  {
    name: 'Frontend node_modules',
    path: 'frontend/node_modules',
    type: 'directory'
  },
  {
    name: 'Backend index.js',
    path: 'backend/index.js',
    type: 'file'
  },
  {
    name: 'Frontend src/main.jsx',
    path: 'frontend/src/main.jsx',
    type: 'file'
  }
];

let passCount = 0;
let failCount = 0;

checks.forEach(check => {
  const fullPath = path.join(__dirname, check.path);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    console.log(`✅ ${check.name}`);
    passCount++;
  } else {
    console.log(`❌ ${check.name} - NOT FOUND`);
    failCount++;
  }
});

console.log(`\n📊 Results: ${passCount} passed, ${failCount} failed\n`);

if (failCount > 0) {
  console.log('⚠️  Fix issues before deploying!\n');
  process.exit(1);
} else {
  console.log('✅ All checks passed! Ready for deployment.\n');
  console.log('Next steps:');
  console.log('1. Create GitHub account (github.com)');
  console.log('2. Create new repository "GMS"');
  console.log('3. Run: node scripts/deploy-setup.js push');
  console.log('4. Go to railway.app and deploy\n');
  process.exit(0);
}
