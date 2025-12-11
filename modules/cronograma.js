// cronograma.js
// Parses inputs and returns human-readable cronograma / divisões

function parseDias(horasStr){
  // espera algo como "1,2,1,2,3,0,0" ou "1 2 1 2 3 0 0"
  if(!horasStr) return [1,1,1,1,1,0,0];
  const parts = horasStr.split(/[;, ]+/).map(p => Number(p)).filter(n => !isNaN(n));
  if(parts.length === 7) return parts;
  // fallback: se só um número dado, distribui igual
  if(parts.length === 1) return Array(7).fill(parts[0]);
  // default
  return [1,1,1,1,1,0,0];
}

function parseMaterias(materiasStr){
  // formato: "História:2:40;Inglês:1:30"
  if(!materiasStr) return [];
  return materiasStr.split(';').map(block => {
    const [nome, prioridade, horas] = block.split(':').map(s => s && s.trim());
    return { nome: nome || 'Materia', prioridade: Number(prioridade)||1, horasTotal: Number(horas)||10 };
  });
}

export function gerarCronograma(diasStr, materiasStr){
  const dias = parseDias(diasStr);
  const materias = parseMaterias(materiasStr);
  if(materias.length === 0) return 'Nenhuma matéria válida detectada.';
  const totalHorasSemana = dias.reduce((a,b)=>a+b,0);
  // peso por prioridade: maior prioridade ganha mais tempo
  const pesoTotal = materias.reduce((s,m)=> s + (3 - (m.prioridade-1)), 0); // prioridade 1->3, 2->2, 3->1
  const map = {};
  materias.forEach(m => map[m.nome] = 0);
  // distribuir horas por matéria proporcional a peso
  materias.forEach(m => {
    const peso = 3 - (m.prioridade-1);
    const horas = (totalHorasSemana * (peso / pesoTotal));
    map[m.nome] = Number(horas.toFixed(1));
  });
  let out = `Horas semanais totais disponíveis: ${totalHorasSemana}\n\n`;
  Object.keys(map).forEach(k => out += `${k}: ${map[k]} h/semana\n`);
  return out;
}

// Divisão de conteúdo: pega horasTotal e divide em blocos semanais padrão
export function dividirConteudo(materiasStr){
  const materias = parseMaterias(materiasStr);
  if(materias.length === 0) return 'Nenhuma matéria para dividir.';
  let out = '';
  materias.forEach(m => {
    const semanas = Math.max(1, Math.ceil(m.horasTotal / 10)); // heurística: 10h/semana por item
    const porSemana = Math.max(1, Math.ceil(m.horasTotal / semanas));
    out += `${m.nome} — ${m.horasTotal}h total → ${semanas} semanas (~${porSemana}h/semana)\n`;
  });
  return out;
}