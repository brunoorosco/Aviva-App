const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/api/protected/churches/[churchid]/baptism/certificados-lista-pdf.ts',
  'src/pages/api/protected/churches/[churchid]/batismo/[id]/index.ts',
  'src/pages/api/protected/churches/[churchid]/batismo/imported.ts',
  'src/pages/api/protected/churches/[churchid]/batismo/list-pdf.ts',
  'src/pages/api/protected/churches/[churchid]/casasdepaz/[id]/index.ts',
  'src/pages/api/protected/churches/[churchid]/casasdepaz/index.ts',
  'src/pages/api/protected/churches/[churchid]/cems/[id]/index.ts',
  'src/pages/api/protected/churches/[churchid]/cems/index.ts',
  'src/pages/api/protected/churches/[churchid]/consagracao/[id]/index.ts',
  'src/pages/api/protected/churches/[churchid]/consagracao/index.ts',
  'src/pages/api/protected/churches/[churchid]/encontroComDeus/[id]/encontrista/[encontristaId]/convert.ts',
  'src/pages/api/protected/churches/[churchid]/encontroComDeus/comprovante/delete.ts',
  'src/pages/api/protected/churches/[churchid]/encontroComDeus/comprovante/signature.ts',
  'src/pages/api/protected/churches/[churchid]/encontroComDeus/import.ts',
  'src/pages/api/protected/churches/[churchid]/encontroComDeus/inscricao/index.ts',
  'src/pages/api/protected/churches/[churchid]/encontroComDeus/inscricao/pagamento.ts',
  'src/pages/api/protected/churches/[churchid]/escola-profeta/[id]/aluno/[alunoId]/presenca.ts',
  'src/pages/api/protected/churches/[churchid]/escola-profeta/[id]/index.ts',
  'src/pages/api/protected/churches/[churchid]/escola-profeta/index.ts',
  'src/pages/api/protected/churches/[churchid]/escola-profeta/new.ts',
  'src/pages/api/protected/churches/[churchid]/event-types/[id]/index.ts',
  'src/pages/api/protected/churches/[churchid]/event-types/index.ts',
  'src/pages/api/protected/churches/[churchid]/events/[id]/index.ts',
  'src/pages/api/protected/churches/[churchid]/events/index.ts',
  'src/pages/api/protected/churches/[churchid]/flow/index.ts',
  'src/pages/api/protected/churches/[churchid]/ministerios/[ministerioid]/index.ts',
  'src/pages/api/protected/churches/[churchid]/ministerios/[ministerioid]/membros.ts',
  'src/pages/api/protected/churches/[churchid]/ministerios/index.ts',
  'src/pages/api/protected/churches/[churchid]/redes/[redeid]/index.ts',
  'src/pages/api/protected/churches/[churchid]/redes/index.ts',
  'src/pages/api/protected/churches/[churchid]/reencontroComDeus/[id]/index.ts',
  'src/pages/api/protected/churches/[churchid]/reencontroComDeus/comprovante/delete.ts',
  'src/pages/api/protected/churches/[churchid]/reencontroComDeus/comprovante/signature.ts',
  'src/pages/api/protected/churches/[churchid]/reencontroComDeus/import.ts',
  'src/pages/api/protected/churches/[churchid]/reencontroComDeus/index.ts',
  'src/pages/api/protected/churches/[churchid]/reencontroComDeus/inscricao/index.ts',
  'src/pages/api/protected/churches/[churchid]/reencontroComDeus/inscricao/pagamento.ts',
  'src/pages/api/protected/churches/[churchid]/secretary/apresentacao/[id].ts',
  'src/pages/api/protected/churches/[churchid]/secretary/apresentacao/index.ts',
  'src/pages/api/protected/churches/[churchid]/secretary/users/index.ts',
  'src/pages/api/protected/churches/[churchid]/sejaLivre/[id]/index.ts',
  'src/pages/api/protected/churches/[churchid]/sejaLivre/index.ts',
  'src/pages/api/protected/churches/[churchid]/users/[userid]/index.ts',
  'src/pages/api/protected/churches/[churchid]/users/[userid]/settings.ts',
  'src/pages/api/protected/churches/[churchid]/users/cargo/[cargo].ts',
  'src/pages/api/protected/churches/[churchid]/visitantes/import.ts',
  'src/pages/api/protected/churches/[churchid]/visitantes/index.ts',
  'src/pages/api/protected/churches/[churchid]/visitasdepaz/[id]/index.ts',
  'src/pages/api/protected/churches/[churchid]/visitasdepaz/index.ts',
  'src/pages/api/protected/churches/index.ts',
  'src/pages/api/protected/users/index.ts'
];

files.forEach(file => {
  const fullPath = path.resolve(process.cwd(), file);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf-8');
  
  // Verifica se há erro de exportação duplicada
  const exportMatches = content.match(/export default/g);
  if (exportMatches && exportMatches.length > 1) {
    // 1. Converter arrow function anônima: export default async (req, res) => {
    content = content.replace(/export default async\s*\((.*?)\)\s*=>\s*\{/, 'async function handler($1) {');
    
    // 2. Converter function anônima: export default async function (req, res) {
    content = content.replace(/export default async function\s*\((.*?)\)\s*\{/, 'async function handler($1) {');

    // 3. Converter function nomeada: export default async function name(req, res) {
    content = content.replace(/export default async function\s+(\w+)\s*\((.*?)\)\s*\{/, 'async function handler($2) {');

    fs.writeFileSync(fullPath, content);
    console.log(`Fixed duplicate export in ${file}`);
  }
});
