import * as fs from 'fs';
import * as path from 'path';

function addReactImport(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if already has React import
  if (content.includes("import React") || content.includes("import * as React")) {
    return;
  }

  // Add import at the beginning of the file
  const newContent = `import React from 'react';\n${content}`;
  fs.writeFileSync(filePath, newContent);
}

function processDirectory(dir: string) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.tsx') && !file.endsWith('.d.tsx')) {
      addReactImport(filePath);
    }
  });
}

// Start processing from src directory
processDirectory('./src'); 