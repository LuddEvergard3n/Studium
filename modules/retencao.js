// retencao.js - Sistema de cálculo de retenção (sem emojis)
export function calcularRetencao(diasDesdeRevisao=0, revisoesFeitas=0, i18n = null){
  let base = 0.6;
  if(revisoesFeitas === 0) base = 0.35;
  
  const gains = [0.0, 0.2, 0.25, 0.3, 0.25, 0.15];
  let bonus = 0;
  for(let i=1; i<=revisoesFeitas && i<gains.length; i++) {
    bonus += gains[i];
  }
  
  const decay = Math.min(diasDesdeRevisao * 0.015, 0.5);
  let reten = base + bonus - decay;
  reten = Math.max(0, Math.min(0.99, reten));
  
  let nextDays = 1;
  if(revisoesFeitas === 0) {
    nextDays = 1;
  } else if(revisoesFeitas === 1) {
    nextDays = 3;
  } else if(revisoesFeitas === 2) {
    nextDays = 7;
  } else if(revisoesFeitas === 3) {
    nextDays = 14;
  } else if(revisoesFeitas === 4) {
    nextDays = 30;
  } else {
    nextDays = 60;
  }
  
  const pct = Math.round(reten*100);
  const hoje = new Date();
  const proximaRevisao = new Date(hoje);
  proximaRevisao.setDate(hoje.getDate() + nextDays);
  
  const lang = i18n ? i18n.getLanguage() : 'pt';
  const dateFormat = lang === 'pt' ? 'pt-BR' : lang === 'es' ? 'es-ES' : 'en-US';
  
  let relatorio = `ANÁLISE DE RETENÇÃO\n`;
  relatorio += `${'='.repeat(50)}\n\n`;
  relatorio += `Retenção Estimada: ${pct}%\n\n`;
  
  const barLength = 30;
  const filled = Math.round((reten * barLength));
  const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);
  relatorio += `[${bar}]\n\n`;
  
  relatorio += `Última revisão: ${diasDesdeRevisao === 0 ? (i18n ? i18n.t('today', 'Hoje') : 'Hoje') : `${diasDesdeRevisao} ${i18n ? i18n.t('daysAgo', 'dia(s) atrás') : 'dia(s) atrás'}`}\n`;
  relatorio += `Revisões realizadas: ${revisoesFeitas}\n\n`;
  
  let status = '';
  if (reten >= 0.8) {
    status = i18n ? i18n.t('excellent', 'Excelente') : 'Excelente';
  } else if (reten >= 0.6) {
    status = i18n ? i18n.t('good', 'Boa') : 'Boa';
  } else if (reten >= 0.4) {
    status = i18n ? i18n.t('moderate', 'Moderada') : 'Moderada';
  } else {
    status = i18n ? i18n.t('lowUrgent', 'Baixa - Revisão Urgente!') : 'Baixa - Revisão Urgente!';
  }
  
  relatorio += `Status: ${status}\n\n`;
  relatorio += `Próxima revisão recomendada:\n`;
  relatorio += `   Em ${nextDays} ${i18n ? i18n.t('days', 'dia(s)') : 'dia(s)'} - ${proximaRevisao.toLocaleDateString(dateFormat, { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}\n\n`;
  
  if (reten < 0.5) {
    relatorio += `Dica: Sua retenção está baixa. Faça uma revisão o quanto antes!\n`;
  } else if (revisoesFeitas < 3) {
    relatorio += `Dica: Continue revisando regularmente para melhorar a retenção a longo prazo.\n`;
  } else {
    relatorio += `Dica: Ótimo trabalho! Continue seguindo o cronograma de revisões.\n`;
  }
  
  return relatorio;
}
