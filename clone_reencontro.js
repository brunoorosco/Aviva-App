const fs = require('fs');
const path = require('path');

const applyReplacements = (text) => {
  let modified = text;
  // Use negative lookbehind to prevent turning "reencontro" into "rereencontro"
  modified = modified.replace(/(?<![rR]e)encontro/g, 'reencontro');
  modified = modified.replace(/(?<![rR]e)Encontro/g, 'Reencontro');
  modified = modified.replace(/(?<![rR]e)ENCONTRO/g, 'REENCONTRO');
  modified = modified.replace(/(?<![rR]e)encontrista/g, 'reencontrista');
  modified = modified.replace(/(?<![rR]e)Encontrista/g, 'Reencontrista');
  modified = modified.replace(/(?<![rR]e)ENCONTRISTA/g, 'REENCONTRISTA');
  return modified;
};

const cloneAndReplaceDir = (srcDir, destDir) => {
  if (!fs.existsSync(srcDir)) return;
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    
    // Rename file if it contains 'Encontro' or 'encontro' (ignoring Reencontro)
    let destName = applyReplacements(entry.name);
    const destPath = path.join(destDir, destName);

    if (entry.isDirectory()) {
      cloneAndReplaceDir(srcPath, destPath);
    } else {
      const content = fs.readFileSync(srcPath, 'utf8');
      const newContent = applyReplacements(content);
      fs.writeFileSync(destPath, newContent, 'utf8');
    }
  }
};

const cloneAndReplaceFile = (srcFile, destFile) => {
  if (!fs.existsSync(srcFile)) return;
  const destDir = path.dirname(destFile);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  
  const content = fs.readFileSync(srcFile, 'utf8');
  const newContent = applyReplacements(content);
  fs.writeFileSync(destFile, newContent, 'utf8');
};

const TARGETS = [
  {
    type: 'dir',
    src: './src/components/encontroComDeus',
    dest: './src/components/reencontroComDeus'
  },
  {
    type: 'dir',
    src: './src/pages/app/[churchid]/secretary/encontroComDeus',
    dest: './src/pages/app/[churchid]/secretary/reencontroComDeus'
  },
  {
    type: 'dir',
    src: './src/pages/api/protected/churches/[churchid]/encontroComDeus',
    dest: './src/pages/api/protected/churches/[churchid]/reencontroComDeus'
  },
  {
    type: 'file',
    src: './src/services/encontroComDeus.ts',
    dest: './src/services/reencontroComDeus.ts'
  },
  {
    type: 'file',
    src: './src/infra/db/repositories/mongo/encontroComDeus.ts',
    dest: './src/infra/db/repositories/mongo/reencontroComDeus.ts'
  }
];

// Clean dest directories first to ensure we don't mix old stuff
for (const target of TARGETS) {
  if (target.type === 'dir' && fs.existsSync(target.dest)) {
    fs.rmSync(target.dest, { recursive: true, force: true });
  }
}

for (const target of TARGETS) {
  if (target.type === 'dir') {
    cloneAndReplaceDir(target.src, target.dest);
  } else {
    cloneAndReplaceFile(target.src, target.dest);
  }
}

console.log('Script completed replacing Encontro with Reencontro.');
