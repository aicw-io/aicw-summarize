#!/usr/bin/env node

/**
 * Build AICW Ask AI Widget
 *
 * 1. Validate syntax (stop if errors found)
 * 2. Minify with terser
 * 3. Add version banner
 *
 * Flags:
 *   --watch          Watch src/widget.js and rebuild on change
 *   --validate-only  Only validate syntax, skip minification
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const vm = require('vm');

const SOURCE_FILE = path.join(__dirname, 'src', 'widget.js');
const OUTPUT_FILE = path.join(__dirname, 'dist', 'aicw-summarize.min.js');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function generateVersion() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  return `${date}.${time}`;
}

function getFileSize(filePath) {
  return (fs.statSync(filePath).size / 1024).toFixed(2);
}

function validate() {
  log('Validating syntax...', 'blue');
  const code = fs.readFileSync(SOURCE_FILE, 'utf8');
  try {
    new vm.Script(code, { filename: 'widget.js' });
    log('  Syntax OK', 'green');
    return true;
  } catch (error) {
    log(`  Syntax error: ${error.message}`, 'red');
    return false;
  }
}

function build() {
  log('\nBuilding AICW Ask AI Widget...', 'blue');
  log(colors.gray + '-'.repeat(50) + colors.reset);

  if (!fs.existsSync(SOURCE_FILE)) {
    log(`Source file not found: ${SOURCE_FILE}`, 'red');
    process.exit(1);
  }

  if (!validate()) {
    log('Build stopped due to validation errors', 'red');
    process.exit(1);
  }

  const sourceSizeBefore = getFileSize(SOURCE_FILE);
  log(`  Source: ${path.relative(process.cwd(), SOURCE_FILE)} (${sourceSizeBefore} KB)`, 'gray');

  log('Minifying...', 'blue');
  try {
    execSync(`npx -y terser "${SOURCE_FILE}" -c -m -o "${OUTPUT_FILE}"`, { stdio: 'pipe' });
  } catch (error) {
    log('Minification failed: ' + error.message, 'red');
    process.exit(1);
  }

  const version = generateVersion();
  const banner = `/*! AICW Ask AI Widget v${version} */`;
  const minified = fs.readFileSync(OUTPUT_FILE, 'utf8');
  fs.writeFileSync(OUTPUT_FILE, banner + minified);

  const outputSize = getFileSize(OUTPUT_FILE);
  const savings = ((1 - (parseFloat(outputSize) / parseFloat(sourceSizeBefore))) * 100).toFixed(1);

  log(`  Output: ${path.relative(process.cwd(), OUTPUT_FILE)} (${outputSize} KB)`, 'gray');
  log(`  Size reduction: ${savings}%`, 'green');
  log(colors.gray + '-'.repeat(50) + colors.reset);
  log(`Build complete! (v${version})`, 'green');
}

// Parse flags
const args = process.argv.slice(2);

if (args.includes('--validate-only')) {
  if (!validate()) process.exit(1);
  process.exit(0);
}

if (args.includes('--watch')) {
  build();
  log('\nWatching for changes...', 'blue');
  let debounce = null;
  fs.watch(SOURCE_FILE, () => {
    if (debounce) clearTimeout(debounce);
    debounce = setTimeout(() => {
      log('\nFile changed, rebuilding...', 'yellow');
      try { build(); } catch (e) { log(e.message, 'red'); }
    }, 200);
  });
} else {
  build();
}
