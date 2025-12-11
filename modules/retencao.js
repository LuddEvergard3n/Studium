// retencao.js
// retorno: string com estimativa de retenção e próxima revisão sugerida

export function calcularRetencao(diasDesdeRevisao=0, revisoesFeitas=0){
  // base: sem revisão = 40% inicial decaindo
  let base = 0.6; // 60% se revisado recentemente
  if(revisoesFeitas === 0) base = 0.35;
  // cada revisão subsequente aumenta a curva
  const gains = [0.0, 0.2, 0.25, 0.3, 0.2]; // por revisão 1..n
  let bonus = 0;
  for(let i=1;i<=revisoesFeitas && i<gains.length;i++) bonus += gains[i];
  let reten = base + bonus - (diasDesdeRevisao * 0.01); // perde 1% por dia
  reten = Math.max(0, Math.min(0.99, reten));
  // próxima revisão: heurística
  let nextDays = 1;
  if(revisoesFeitas === 0) nextDays = 1;
  else if(revisoesFeitas === 1) nextDays = 3;
  else if(revisoesFeitas === 2) nextDays = 7;
  else nextDays = 14;
  const pct = Math.round(reten*100);
  const hoje = new Date();
  hoje.setDate(hoje.getDate() + nextDays);
  return `Retenção estimada: ${pct}%\nPróxima revisão recomendada em ${nextDays} dias (${hoje.toLocaleDateString()})`;
}