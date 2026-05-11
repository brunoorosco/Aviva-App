import fs from 'fs';
import path from 'path';

const apiDir = path.join(process.cwd(), 'src/pages/api/protected');

function getFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = entries.map((entry) => {
    const res = path.resolve(dir, entry.name);
    return entry.isDirectory() ? getFiles(res) : res;
  });
  return Array.prototype.concat(...files);
}

describe('Cobertura de Auditoria da API', () => {
  const files = getFiles(apiDir).filter(f => 
    f.endsWith('.ts') && 
    !f.endsWith('.test.ts') && 
    !f.includes('[...nextauth]')
  );

  test.each(files)('Verificando se %s está auditado', (file) => {
    const relativePath = path.relative(process.cwd(), file);
    const content = fs.readFileSync(file, 'utf-8');
    
    // Critérios para precisar de auditoria: possuir métodos de modificação
    const needsAudit = (
      content.includes("'POST'") || content.includes('"POST"') ||
      content.includes("'PUT'") || content.includes('"PUT"') ||
      content.includes("'DELETE'") || content.includes('"DELETE"') ||
      content.includes("'PATCH'") || content.includes('"PATCH"')
    );

    const isAudited = content.includes('withAudit');

    if (needsAudit && !isAudited) {
      throw new Error(`Falha de Segurança: A rota ${relativePath} realiza operações de escrita mas não possui o wrapper withAudit.`);
    }
  });
});
