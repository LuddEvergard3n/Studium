// cronograma.js - Sistema de cronograma com grade semanal visual
const DIAS_SEMANA = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
const DIAS_SEMANA_EN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DIAS_SEMANA_ES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

function getDiasSemana(lang) {
  if (lang === 'en') return DIAS_SEMANA_EN;
  if (lang === 'es') return DIAS_SEMANA_ES;
  return DIAS_SEMANA;
}

function parseDias(horasStr){
  if(!horasStr) return [1,1,1,1,1,0,0];
  const parts = horasStr.split(/[;, ]+/).map(p => Number(p.trim())).filter(n => !isNaN(n) && n >= 0);
  if(parts.length === 7) return parts;
  if(parts.length === 1) return Array(7).fill(parts[0]);
  return [1,1,1,1,1,0,0];
}

function parseMaterias(materiasStr){
  if(!materiasStr) return [];
  
  // Aceita múltiplos formatos: ; ou espaço como separador
  // Ex: "História:1:40;Matemática:2:30" ou "História:1:40 Matemática:2:30"
  const separators = /[;,\n]+/;
  const blocks = materiasStr.split(separators).map(s => s.trim()).filter(s => s);
  
  return blocks.map(block => {
    // Tenta encontrar padrão Nome:Prioridade:Horas
    const parts = block.split(':').map(s => s.trim());
    
    if (parts.length >= 3) {
      // Formato: Nome:Prioridade:Horas
      return {
        nome: parts[0],
        prioridade: Number(parts[1]) || 1,
        horasTotal: Number(parts[2]) || 10
      };
    } else if (parts.length === 2) {
      // Formato: Nome:Horas (prioridade padrão 2)
      return {
        nome: parts[0],
        prioridade: 2,
        horasTotal: Number(parts[1]) || 10
      };
    } else {
      // Apenas nome (valores padrão)
      return {
        nome: parts[0] || block,
        prioridade: 2,
        horasTotal: 10
      };
    }
  }).filter(m => m.nome && m.nome.length > 0);
}

function distribuirHorasPorDia(dias, materias, horasPorMateria) {
  const distribuicao = {};
  materias.forEach(m => {
    distribuicao[m.nome] = Array(7).fill(0);
  });
  
  materias.forEach(m => {
    const horasSemana = horasPorMateria[m.nome];
    let horasRestantes = horasSemana;
    
    const diasDisponiveis = dias.filter(h => h > 0);
    if (diasDisponiveis.length === 0) return;
    
    const horasPorDiaDisponivel = horasSemana / diasDisponiveis.reduce((a, b) => a + b, 0);
    
    dias.forEach((horasDia, idx) => {
      if (horasDia > 0 && horasRestantes > 0) {
        const horasAlocadas = Math.min(horasRestantes, horasDia * horasPorDiaDisponivel);
        distribuicao[m.nome][idx] = Number(horasAlocadas.toFixed(1));
        horasRestantes -= horasAlocadas;
      }
    });
  });
  
  return distribuicao;
}

export function gerarCronograma(diasStr, materiasStr, container = null, gridContainer = null, i18n = null){
  const dias = parseDias(diasStr);
  const materias = parseMaterias(materiasStr);
  const lang = i18n ? i18n.getLanguage() : 'pt';
  const diasSemana = getDiasSemana(lang);
  
  if(materias.length === 0) {
    return i18n ? i18n.t('noSubjects', 'Nenhuma matéria válida detectada. Use o formato: Nome:Prioridade:TotalHoras') : 'Nenhuma matéria válida detectada. Use o formato: Nome:Prioridade:TotalHoras';
  }
  
  const totalHorasSemana = dias.reduce((a,b)=>a+b,0);
  
  if (totalHorasSemana === 0) {
    return i18n ? i18n.t('noHours', 'Nenhuma hora disponível na semana. Configure as horas por dia.') : 'Nenhuma hora disponível na semana. Configure as horas por dia.';
  }
  
  const pesoTotal = materias.reduce((s,m)=> {
    const peso = 4 - m.prioridade;
    return s + peso;
  }, 0);
  
  const horasPorMateria = {};
  materias.forEach(m => {
    const peso = 4 - m.prioridade;
    const horas = (totalHorasSemana * (peso / pesoTotal));
    horasPorMateria[m.nome] = Number(horas.toFixed(1));
  });
  
  const distribuicao = distribuirHorasPorDia(dias, materias, horasPorMateria);
  
  let out = `CRONOGRAMA SEMANAL\n`;
  out += `${'='.repeat(50)}\n\n`;
  out += `Horas semanais totais disponíveis: ${totalHorasSemana}h\n\n`;
  out += `DISTRIBUIÇÃO POR MATÉRIA:\n`;
  out += `${'-'.repeat(50)}\n`;
  
  Object.keys(horasPorMateria).forEach(nome => {
    const materia = materias.find(m => m.nome === nome);
    const prioridadeLabel = materia.prioridade === 1 ? 'Alta' : materia.prioridade === 2 ? 'Média' : 'Baixa';
    out += `${nome}: ${horasPorMateria[nome]}h/semana (Prioridade ${materia.prioridade} - ${prioridadeLabel})\n`;
  });
  
  // Tabela HTML melhorada
  if (container) {
    let tableHTML = `
      <div style="margin-top: 1.5rem; overflow-x: auto;">
        <table class="cronograma-table">
          <thead>
            <tr>
              <th style="min-width: 150px;">Matéria</th>
              ${diasSemana.map(dia => `<th style="min-width: 100px;">${dia}</th>`).join('')}
              <th style="min-width: 80px;">Total</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    materias.forEach((m, idx) => {
      const total = distribuicao[m.nome].reduce((a, b) => a + b, 0);
      const prioridadeLabel = m.prioridade === 1 ? 'Alta' : m.prioridade === 2 ? 'Média' : 'Baixa';
      const priorityColor = m.prioridade === 1 ? 'var(--color-red)' : m.prioridade === 2 ? 'var(--color-yellow)' : 'var(--color-green)';
      
      tableHTML += `
        <tr data-materia-idx="${idx}">
          <td style="position: sticky; left: 0; background: var(--bg-card); z-index: 1;">
            <strong>${m.nome}</strong><br>
            <small style="color: var(--text-secondary); font-size: 0.75rem;">Prioridade ${m.prioridade} (${prioridadeLabel})</small>
          </td>
          ${distribuicao[m.nome].map((horas, dayIdx) => {
            const horasDia = dias[dayIdx];
            const cellStyle = horas > 0 ? `background: ${priorityColor}15; border-left: 3px solid ${priorityColor};` : 'background: var(--bg-secondary);';
            return `
              <td style="${cellStyle}" class="editable-cell" data-materia="${idx}" data-dia="${dayIdx}" contenteditable="true">
                ${horas > 0 ? `<strong>${horas.toFixed(1)}h</strong>` : '<span style="color: var(--text-muted);">-</span>'}
                <br><small style="color: var(--text-secondary); font-size: 0.7rem;">(${horasDia}h disp.)</small>
              </td>
            `;
          }).join('')}
          <td style="background: var(--bg-secondary); font-weight: 600;">${total.toFixed(1)}h</td>
        </tr>
      `;
    });
    
    tableHTML += `
            <tr style="background: var(--bg-secondary); font-weight: 600; position: sticky; bottom: 0;">
              <td style="position: sticky; left: 0; background: var(--bg-secondary); z-index: 2;"><strong>Total</strong></td>
              ${dias.map(horas => `<td><strong>${horas}h</strong></td>`).join('')}
              <td><strong>${totalHorasSemana}h</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p style="margin-top: 1rem; font-size: 0.75rem; color: var(--text-secondary);">
        Dica: Clique nas células para editar as horas alocadas
      </p>
    `;
    
    container.innerHTML = tableHTML;
    
    // Adiciona funcionalidade de edição
    container.querySelectorAll('.editable-cell').forEach(cell => {
      cell.addEventListener('blur', () => {
        const text = cell.textContent.trim();
        const match = text.match(/(\d+\.?\d*)/);
        if (match) {
          const horas = parseFloat(match[1]);
          // Aqui você pode salvar as alterações se necessário
          console.log('Horas editadas:', horas);
        }
      });
      
      cell.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          cell.blur();
        }
      });
    });
  }
  
  // Grade Semanal Visual melhorada
  if (gridContainer) {
    let gridHTML = '<div style="margin-top: 1.5rem;"><h3 style="font-size: 1rem; margin-bottom: 1rem; color: var(--text-primary);">Visualização Semanal</h3>';
    gridHTML += '<div class="weekly-grid">';
    
    diasSemana.forEach((dia, idx) => {
      const horasDia = dias[idx];
      const blocos = [];
      
      materias.forEach(m => {
        const horas = distribuicao[m.nome][idx];
        if (horas > 0) {
          blocos.push({
            nome: m.nome,
            horas: horas,
            prioridade: m.prioridade
          });
        }
      });
      
      const priorityColor = (p) => p === 1 ? 'var(--color-red)' : p === 2 ? 'var(--color-yellow)' : 'var(--color-green)';
      const totalHorasDia = blocos.reduce((sum, b) => sum + b.horas, 0);
      
      gridHTML += `
        <div class="week-day" style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: var(--space-md);">
          <div class="week-day-header" style="font-weight: 600; margin-bottom: var(--space-sm); padding-bottom: var(--space-sm); border-bottom: 1px solid var(--border-color);">
            ${dia}<br>
            <small style="color: var(--text-secondary); font-size: 0.75rem;">${horasDia}h disponíveis</small>
            ${totalHorasDia > 0 ? `<br><small style="color: var(--color-green); font-size: 0.75rem; font-weight: 600;">${totalHorasDia.toFixed(1)}h alocadas</small>` : ''}
          </div>
          <div style="display: flex; flex-direction: column; gap: var(--space-xs);">
            ${blocos.length > 0 ? blocos.map(bloco => `
              <div class="week-block" style="border-left: 4px solid ${priorityColor(bloco.prioridade)}; background: ${priorityColor(bloco.prioridade)}15; padding: var(--space-sm); border-radius: var(--radius-sm);">
                <div style="font-weight: 600; font-size: 0.875rem; margin-bottom: 0.25rem;">${bloco.nome}</div>
                <div style="font-size: 0.75rem; color: var(--text-secondary);">${bloco.horas.toFixed(1)}h</div>
              </div>
            `).join('') : '<div style="color: var(--text-muted); font-size: 0.75rem; text-align: center; padding: var(--space-md);">Sem atividades</div>'}
          </div>
        </div>
      `;
    });
    
    gridHTML += '</div></div>';
    gridContainer.innerHTML = gridHTML;
  }
  
  return out;
}

export function dividirConteudo(materiasStr, i18n = null){
  const materias = parseMaterias(materiasStr);
  if(materias.length === 0) {
    return i18n ? i18n.t('noSubjectsToDivide', 'Nenhuma matéria para dividir.') : 'Nenhuma matéria para dividir.';
  }
  
  let out = `DIVISÃO DE CONTEÚDO\n`;
  out += `${'='.repeat(50)}\n\n`;
  
  materias.forEach(m => {
    const semanas = Math.max(1, Math.ceil(m.horasTotal / 10));
    const porSemana = Math.max(1, Math.ceil(m.horasTotal / semanas));
    const prioridadeLabel = m.prioridade === 1 ? 'Alta' : m.prioridade === 2 ? 'Média' : 'Baixa';
    
    out += `${m.nome}\n`;
    out += `   Total: ${m.horasTotal}h\n`;
    out += `   Duração estimada: ${semanas} semana(s)\n`;
    out += `   Carga semanal: ~${porSemana}h/semana\n`;
    out += `   Prioridade: ${m.prioridade} (${prioridadeLabel})\n\n`;
  });
  
  return out;
}
