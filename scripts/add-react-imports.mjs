import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const REACT_IMPORT = `'use client';
import * as React from 'react';

`;

async function processFile(filePath) {
  const content = await readFile(filePath, 'utf8');
  
  // Skip if already has React import or use client
  if (content.includes('import React') || content.includes('import * as React') || content.includes('use client')) {
    return;
  }

  // Add import at the beginning of the file
  const newContent = REACT_IMPORT + content;
  await writeFile(filePath, newContent);
  console.log(`✅ Added React import to ${filePath}`);
}

async function* walk(dir) {
  const files = await readdir(dir, { withFileTypes: true });
  for (const file of files) {
    const path = join(dir, file.name);
    if (file.isDirectory()) {
      yield* walk(path);
    } else if (file.name.endsWith('.tsx') && !file.name.endsWith('.d.tsx')) {
      yield path;
    }
  }
}

async function main() {
  try {
    for await (const filePath of walk('./src')) {
      await processFile(filePath);
    }
    console.log('✨ All files processed successfully');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main(); 