#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TARGETS = [
  path.join(ROOT, 'src', 'widget.js'),
  path.join(ROOT, 'dist', 'aicw-summarize.min.js')
];

const forbiddenPatterns = [
  {
    pattern: /\bdocument\.documentElement\b/g,
    reason: 'must not mutate the host document theme or root element'
  },
  {
    pattern: /\bdocument\.body\.style\b|\bbody\.style\b/g,
    reason: 'must not write page-wide body styles'
  },
  {
    pattern: /querySelector(?:All)?\(\s*['"]body['"]/g,
    reason: 'must not target the host body element'
  },
  {
    pattern: /\bstyle\.(?:opacity|filter|backdropFilter)\b/g,
    reason: 'must not set opacity/filter/backdropFilter styles'
  },
  {
    pattern: /-?webkit-backdrop-filter\s*:|backdrop-filter\s*:/g,
    reason: 'must not use backdrop filters that can blur host-page text'
  },
  {
    pattern: /transition\s*:[^;"'}]*opacity/g,
    reason: 'must not animate opacity in the widget stylesheet'
  },
  {
    pattern: /opacity\s*:\s*(?:0|1)\b/g,
    reason: 'must not use opacity to hide/show widget UI'
  },
  {
    pattern: /(?:^|[{},"'])\s*\.aicw-(?:trigger|trigger-text|close|popup-title|popup-icons-row|popup-icon-btn|popup-separator|popup-close|popup-description(?:-wrapper|-label)?)(?:[,{:\s.#])/g,
    reason: 'widget CSS selectors must stay scoped under #aicw-ask-ai-bar or #aicw-ask-ai-popup'
  }
];

let failed = false;

for (const filePath of TARGETS) {
  const relative = path.relative(ROOT, filePath);
  if (!fs.existsSync(filePath)) {
    console.error(`Missing expected file: ${relative}`);
    failed = true;
    continue;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  for (const { pattern, reason } of forbiddenPatterns) {
    pattern.lastIndex = 0;
    const match = pattern.exec(content);
    if (match) {
      const before = content.slice(0, match.index);
      const line = before.split('\n').length;
      const column = before.length - before.lastIndexOf('\n');
      console.error(`${relative}:${line}:${column}: ${reason}`);
      console.error(`  matched: ${match[0].trim()}`);
      failed = true;
    }
  }
}

if (failed) {
  process.exit(1);
}

console.log('Widget safety check passed: no page-wide dimming, blur, or unscoped CSS selectors found.');
