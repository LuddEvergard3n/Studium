// main.js - STUDIUM - Sistema Universal de Estudos e Métricas
import { gerarCronograma, dividirConteudo } from './modules/cronograma.js';
import { Pomodoro } from './modules/pomodoro.js';
import { calcularRetencao } from './modules/retencao.js';
import { Habitos } from './modules/habitos.js';
import { atualizarDashboard } from './modules/dashboard.js';
import { Modal } from './modules/modal.js';
import { i18n } from './modules/i18n.js';
import { generatePDFReport } from './modules/pdf-report.js';

// Variáveis globais
let pomodoro = null;
let habitos = null;
let focusMode = false;

// ============================================
// TEMA (CLARO/ESCURO)
// ============================================
function initTheme() {
  const savedTheme = localStorage.getItem("studium_theme") || "light";
  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }
  
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      if (isDark) {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("studium_theme", "light");
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("studium_theme", "dark");
      }
    });
  }
}

// ============================================
// INTERNACIONALIZAÇÃO
// ============================================
function initI18n() {
  // Atualiza UI inicial
  i18n.updateUI();
  
  // Event listeners para mudança de idioma
  const langPt = document.getElementById('langPt');
  const langEn = document.getElementById('langEn');
  const langEs = document.getElementById('langEs');
  
  if (langPt) {
    langPt.addEventListener('click', () => {
      i18n.setLanguage('pt');
      updateLangButtons();
      i18n.updateUI();
      updateAllContent();
    });
  }
  
  if (langEn) {
    langEn.addEventListener('click', () => {
      i18n.setLanguage('en');
      updateLangButtons();
      i18n.updateUI();
      updateAllContent();
    });
  }
  
  if (langEs) {
    langEs.addEventListener('click', () => {
      i18n.setLanguage('es');
      updateLangButtons();
      i18n.updateUI();
      updateAllContent();
    });
  }
  
  updateLangButtons();
}

function updateLangButtons() {
  const lang = i18n.getLanguage();
  document.querySelectorAll('.lang-selector button').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-lang') === lang) {
      btn.classList.add('active');
    }
  });
}

function updateAllContent() {
  if (habitos) {
    const container = document.getElementById('habitosList');
    if (container) habitos.render(container, i18n);
  }
  
  const dashStats = document.getElementById('dashStats');
  if (dashStats) {
    atualizarDashboard(dashStats, habitos, pomodoro, i18n);
  }
}

// ============================================
// NAVEGAÇÃO POR TABS
// ============================================
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const panels = document.querySelectorAll('.panel');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPanel = link.getAttribute('data-panel');
      
      navLinks.forEach(l => l.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      
      link.classList.add('active');
      const panel = document.getElementById(targetPanel);
      if (panel) {
        panel.classList.add('active');
        
        // Atualiza dashboard se for o painel ativo
        if (targetPanel === 'dashboard') {
          setTimeout(() => {
            const dashStats = document.getElementById('dashStats');
            if (dashStats) {
              atualizarDashboard(dashStats, habitos, pomodoro, i18n);
            }
          }, 100);
        }
      }
    });
  });
  
  const firstLink = document.querySelector('.nav-link.active');
  if (firstLink) {
    const firstPanel = firstLink.getAttribute('data-panel');
    const panel = document.getElementById(firstPanel);
    if (panel) {
      panel.classList.add('active');
    }
  }
}

// ============================================
// CRONOGRAMA
// ============================================
let materiasList = JSON.parse(localStorage.getItem('studium_materias') || '[]');

function saveMaterias() {
  localStorage.setItem('studium_materias', JSON.stringify(materiasList));
}

function renderMateriasList() {
  const container = document.getElementById('materiasList');
  if (!container) return;
  
  if (materiasList.length === 0) {
    container.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.875rem; text-align: center; padding: var(--space-lg);">Nenhuma matéria adicionada ainda.</p>';
    // Limpa o cronograma se não houver matérias
    const tableContainer = document.getElementById('cronogramaTable');
    const gridContainer = document.getElementById('cronogramaGrid');
    const output = document.getElementById('cronogramaOutput');
    if (tableContainer) tableContainer.innerHTML = '';
    if (gridContainer) gridContainer.innerHTML = '';
    if (output) {
      output.textContent = '';
      output.style.display = 'none';
    }
    return;
  }
  
  container.innerHTML = `
    <div style="background: var(--bg-secondary); padding: var(--space-md); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
      <h3 style="font-size: 0.875rem; margin-bottom: var(--space-md); color: var(--text-primary); font-weight: 600;">Matérias Adicionadas (${materiasList.length})</h3>
      <div style="display: flex; flex-direction: column; gap: var(--space-sm);">
        ${materiasList.map((m, idx) => {
          const prioridadeLabel = m.prioridade === 1 ? 'Alta' : m.prioridade === 2 ? 'Média-Alta' : m.prioridade === 3 ? 'Média' : m.prioridade === 4 ? 'Média-Baixa' : m.prioridade === 5 ? 'Baixa' : m.prioridade === 6 ? 'Muito Baixa' : 'Mínima';
          const priorityColor = m.prioridade <= 2 ? 'var(--color-red)' : m.prioridade <= 4 ? 'var(--color-yellow)' : 'var(--color-green)';
          return `
            <div style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-sm); background: var(--bg-card); border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
              <div style="flex: 1;">
                <strong style="color: var(--text-primary);">${m.nome}</strong>
                <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">
                  Prioridade ${m.prioridade} (${prioridadeLabel}) • ${m.horasTotal}h totais
                </div>
              </div>
              <div style="width: 4px; height: 2rem; background: ${priorityColor}; border-radius: 2px;"></div>
              <button class="small danger" data-remove-materia="${idx}" style="flex: 0 0 auto;">Remover</button>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
  
  // Event listeners para remover
  container.querySelectorAll('[data-remove-materia]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-remove-materia'));
      materiasList.splice(idx, 1);
      saveMaterias();
      renderMateriasList();
      gerarCronogramaAuto();
    });
  });
}

function gerarCronogramaAuto() {
  const dias = document.getElementById('diasHoras')?.value || '';
  const tableContainer = document.getElementById('cronogramaTable');
  const gridContainer = document.getElementById('cronogramaGrid');
  const output = document.getElementById('cronogramaOutput');
  
  if (materiasList.length === 0) {
    if (tableContainer) tableContainer.innerHTML = '';
    if (gridContainer) gridContainer.innerHTML = '';
    if (output) {
      output.textContent = '';
      output.style.display = 'none';
    }
    return;
  }
  
  const materiasStr = materiasToString();
  const cron = gerarCronograma(dias, materiasStr, tableContainer, gridContainer, i18n);
  if (output) {
    output.textContent = cron;
    output.style.display = 'block';
  }
}

function materiasToString() {
  return materiasList.map(m => `${m.nome}:${m.prioridade}:${m.horasTotal}`).join(';');
}

function initCronograma() {
  const btnGerar = document.getElementById('btnGerarCrono');
  const btnAddMateria = document.getElementById('btnAddMateria');
  const btnLimparMaterias = document.getElementById('btnLimparMaterias');
  const materiaNome = document.getElementById('materiaNome');
  const materiaPrioridade = document.getElementById('materiaPrioridade');
  const materiaHoras = document.getElementById('materiaHoras');
  const output = document.getElementById('cronogramaOutput');
  const tableContainer = document.getElementById('cronogramaTable');
  const gridContainer = document.getElementById('cronogramaGrid');
  
  // Renderiza lista inicial
  renderMateriasList();
  
  // Adicionar matéria
  if (btnAddMateria && materiaNome && materiaPrioridade && materiaHoras) {
    btnAddMateria.addEventListener('click', () => {
      const nome = materiaNome.value.trim();
      const prioridade = Number(materiaPrioridade.value);
      const horas = Number(materiaHoras.value);
      
      if (!nome) {
        Modal.alert('Por favor, digite o nome da matéria.', i18n.t('appName'));
        return;
      }
      
      if (horas <= 0) {
        Modal.alert('Por favor, digite um número válido de horas.', i18n.t('appName'));
        return;
      }
      
      materiasList.push({
        nome: nome,
        prioridade: prioridade,
        horasTotal: horas
      });
      
      saveMaterias();
      renderMateriasList();
      gerarCronogramaAuto();
      
      // Limpa campos
      materiaNome.value = '';
      materiaPrioridade.value = '2';
      materiaHoras.value = '10';
      materiaNome.focus();
    });
    
    // Enter para adicionar
    [materiaNome, materiaHoras].forEach(input => {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          btnAddMateria.click();
        }
      });
    });
  }
  
  // Limpar matérias
  if (btnLimparMaterias) {
    btnLimparMaterias.addEventListener('click', () => {
      Modal.confirm('Tem certeza que deseja remover todas as matérias?', 'Confirmar').then(confirmed => {
        if (confirmed) {
          materiasList = [];
          saveMaterias();
          renderMateriasList();
          gerarCronogramaAuto();
        }
      });
    });
  }
  
  // Atualiza cronograma quando horas disponíveis mudarem
  const diasHorasInput = document.getElementById('diasHoras');
  if (diasHorasInput) {
    diasHorasInput.addEventListener('input', () => {
      gerarCronogramaAuto();
    });
    
    diasHorasInput.addEventListener('change', () => {
      gerarCronogramaAuto();
    });
  }
  
  // Gera cronograma inicial se houver matérias salvas
  if (materiasList.length > 0) {
    setTimeout(() => {
      gerarCronogramaAuto();
    }, 300);
  }
}

// ============================================
// POMODORO
// ============================================
function initPomodoro() {
  const pomFocus = document.getElementById('pomFocus');
  const pomShort = document.getElementById('pomShort');
  const pomLong = document.getElementById('pomLong');
  const pomDisplay = document.getElementById('pomDisplay');
  const pomState = document.getElementById('pomState');
  const pomStart = document.getElementById('pomStart');
  const pomStop = document.getElementById('pomStop');
  const pomReset = document.getElementById('pomReset');
  const pomCyclesToday = document.getElementById('pomCyclesToday');
  const pomTotalCycles = document.getElementById('pomTotalCycles');
  const pomTotalTime = document.getElementById('pomTotalTime');
  
  if (!pomDisplay || !pomState) return;
  
  function updatePomodoroDisplay(mmss, state) {
    if (pomDisplay) pomDisplay.textContent = mmss;
    if (pomState) pomState.textContent = i18n.t(state === 'idle' ? 'ready' : state === 'focus' ? 'focus' : state === 'short' ? 'shortBreak' : 'longBreak');
  }
  
  function updatePomodoroStats() {
    if (pomodoro) {
      const stats = pomodoro.getStats();
      if (pomCyclesToday) pomCyclesToday.textContent = stats.todayCycles;
      if (pomTotalCycles) pomTotalCycles.textContent = stats.totalCycles;
      const hours = Math.floor(stats.totalTime / 60);
      const minutes = stats.totalTime % 60;
      if (pomTotalTime) pomTotalTime.textContent = hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
      
      // Atualiza dashboard se visível
      const dashboardPanel = document.getElementById('dashboard');
      if (dashboardPanel && dashboardPanel.classList.contains('active')) {
        const dashStats = document.getElementById('dashStats');
        if (dashStats) {
          atualizarDashboard(dashStats, habitos, pomodoro, i18n);
        }
      }
    }
  }
  
  function createPomodoro() {
    pomodoro = new Pomodoro({
      focoMin: Number(pomFocus?.value || 25),
      curtoMin: Number(pomShort?.value || 5),
      longoMin: Number(pomLong?.value || 15),
      onTick: updatePomodoroDisplay,
      onComplete: () => {
        updatePomodoroStats();
        if (Notification.permission === 'granted') {
          new Notification('Pomodoro Completo!', {
            body: 'Ciclo de foco finalizado. Hora da pausa!'
          });
        }
      }
    });
    updatePomodoroDisplay(pomodoro.format(pomodoro.remaining), pomodoro.getStateLabel());
    updatePomodoroStats();
  }
  
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
  
  if (pomFocus && pomShort && pomLong) {
    [pomFocus, pomShort, pomLong].forEach(input => {
      input.addEventListener('change', () => {
        if (pomodoro) {
          pomodoro.updateSettings(
            Number(pomFocus.value || 25),
            Number(pomShort.value || 5),
            Number(pomLong.value || 15)
          );
        }
      });
    });
  }
  
  if (pomStart) {
    pomStart.addEventListener('click', () => {
      if (!pomodoro) createPomodoro();
      pomodoro.start();
      if (pomStart) pomStart.disabled = true;
      if (pomStop) pomStop.disabled = false;
    });
  }
  
  if (pomStop) {
    pomStop.addEventListener('click', () => {
      if (pomodoro) {
        pomodoro.stop();
        if (pomStart) pomStart.disabled = false;
        if (pomStop) pomStop.disabled = false;
      }
    });
  }
  
  if (pomReset) {
    pomReset.addEventListener('click', () => {
      if (pomodoro) {
        pomodoro.reset();
        if (pomStart) pomStart.disabled = false;
        if (pomStop) pomStop.disabled = false;
        updatePomodoroStats();
      }
    });
  }
  
  createPomodoro();
  setInterval(updatePomodoroStats, 5000);
}

// ============================================
// RETENÇÃO
// ============================================
function initRetencao() {
  const btnCalcular = document.getElementById('btnCalcularRetencao');
  const output = document.getElementById('retencaoOutput');
  
  if (btnCalcular && output) {
    btnCalcular.addEventListener('click', () => {
      const dias = Number(document.getElementById('diasDesdeRevisao')?.value || 0);
      const revisoes = Number(document.getElementById('revisoesFeitas')?.value || 0);
      const out = calcularRetencao(dias, revisoes, i18n);
      output.textContent = out;
    });
  }
}

// ============================================
// HÁBITOS
// ============================================
function initHabitos() {
  habitos = new Habitos('studium_habits');
  const habitosList = document.getElementById('habitosList');
  const btnAdd = document.getElementById('btnAddHabito');
  const habitoNome = document.getElementById('habitoNome');
  
  if (habitosList) {
    habitos.render(habitosList, i18n);
  }
  
  if (btnAdd && habitoNome) {
    btnAdd.addEventListener('click', () => {
      const nome = habitoNome.value.trim();
      if (!nome) {
        Modal.alert(i18n.t('habitNameRequired'), i18n.t('appName'));
        return;
      }
      if (habitos.add(nome)) {
        if (habitosList) habitos.render(habitosList, i18n);
        habitoNome.value = '';
        habitoNome.focus();
        updateDashboardIfVisible();
      }
    });
    
    habitoNome.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        btnAdd.click();
      }
    });
  }
}

// ============================================
// DASHBOARD
// ============================================
function updateDashboardIfVisible() {
  const dashboardPanel = document.getElementById('dashboard');
  if (dashboardPanel && dashboardPanel.classList.contains('active')) {
    const dashStats = document.getElementById('dashStats');
    if (dashStats) {
      atualizarDashboard(dashStats, habitos, pomodoro, i18n);
    }
  }
}

function initDashboard() {
  const btnAtualizar = document.getElementById('btnAtualizarDash');
  const dashStats = document.getElementById('dashStats');
  
  if (btnAtualizar && dashStats) {
    btnAtualizar.addEventListener('click', () => {
      atualizarDashboard(dashStats, habitos, pomodoro, i18n);
    });
  }
  
  const dashboardLink = document.querySelector('[data-panel="dashboard"]');
  if (dashboardLink && dashStats) {
    dashboardLink.addEventListener('click', () => {
      setTimeout(() => {
        atualizarDashboard(dashStats, habitos, pomodoro, i18n);
      }, 100);
    });
  }
  
  // Inicializa dashboard imediatamente
  if (dashStats) {
    setTimeout(() => {
      atualizarDashboard(dashStats, habitos, pomodoro, i18n);
    }, 500);
  }
}

// ============================================
// EXPORT/IMPORT
// ============================================
function initExport() {
  const exportBtn = document.getElementById('exportBtn');
  
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const state = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        cronograma: {
          diasHoras: document.getElementById('diasHoras')?.value || '',
          materias: document.getElementById('materiasInput')?.value || ''
        },
        pomodoro: pomodoro ? pomodoro.getStats() : null,
        habitos: habitos ? habitos.getAll() : [],
        retencao: {
          diasDesdeRevisao: document.getElementById('diasDesdeRevisao')?.value || '',
          revisoesFeitas: document.getElementById('revisoesFeitas')?.value || ''
        }
      };
      
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `studium_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      const originalText = exportBtn.textContent;
      exportBtn.textContent = '✓';
      setTimeout(() => {
        exportBtn.textContent = originalText;
      }, 2000);
    });
  }
}

function initImport() {
  const importBtn = document.getElementById('importBtn');
  if (!importBtn) return;
  
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);
  
  importBtn.addEventListener('click', () => {
    fileInput.click();
  });
  
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        // Restaura dados
        if (data.cronograma) {
          const diasHorasInput = document.getElementById('diasHoras');
          const materiasInput = document.getElementById('materiasInput');
          if (diasHorasInput && data.cronograma.diasHoras) {
            diasHorasInput.value = data.cronograma.diasHoras;
          }
          if (materiasInput && data.cronograma.materias) {
            materiasInput.value = data.cronograma.materias;
          }
        }
        
        if (data.habitos && Array.isArray(data.habitos)) {
          localStorage.setItem('studium_habits', JSON.stringify(data.habitos));
          habitos = new Habitos('studium_habits');
          const habitosList = document.getElementById('habitosList');
          if (habitosList) {
            habitos.render(habitosList, i18n);
          }
        }
        
        if (data.retencao) {
          const diasInput = document.getElementById('diasDesdeRevisao');
          const revisoesInput = document.getElementById('revisoesFeitas');
          if (diasInput && data.retencao.diasDesdeRevisao) {
            diasInput.value = data.retencao.diasDesdeRevisao;
          }
          if (revisoesInput && data.retencao.revisoesFeitas) {
            revisoesInput.value = data.retencao.revisoesFeitas;
          }
        }
        
        Modal.alert(i18n.t('importSuccess'), i18n.t('appName'));
        updateDashboardIfVisible();
      } catch (error) {
        Modal.alert(i18n.t('importError'), i18n.t('appName'));
      }
    };
    reader.readAsText(file);
  });
}

// ============================================
// PDF REPORT
// ============================================
function initPDF() {
  const pdfBtn = document.getElementById('pdfBtn');
  
  if (pdfBtn) {
    pdfBtn.addEventListener('click', async () => {
      if (!habitos || !pomodoro) {
        Modal.alert(i18n.t('noDataToExport'), i18n.t('appName'));
        return;
      }
      
      try {
        await generatePDFReport(habitos, pomodoro, i18n);
      } catch (error) {
        Modal.alert('Erro ao gerar PDF: ' + error.message, i18n.t('appName'));
      }
    });
  }
}

// ============================================
// MODO FOCO
// ============================================
function initFocusMode() {
  const focusBtn = document.getElementById('focusModeBtn');
  
  if (focusBtn) {
    focusBtn.addEventListener('click', () => {
      focusMode = !focusMode;
      
      if (focusMode) {
        document.body.classList.add('focus-mode');
        const activePanel = document.querySelector('.panel.active');
        if (activePanel) {
          const exitBtn = document.createElement('button');
          exitBtn.className = 'focus-exit';
          exitBtn.textContent = i18n.t('close', 'Sair');
          exitBtn.addEventListener('click', () => {
            document.body.classList.remove('focus-mode');
            exitBtn.remove();
            focusMode = false;
          });
          document.body.appendChild(exitBtn);
        }
      } else {
        document.body.classList.remove('focus-mode');
        const exitBtn = document.querySelector('.focus-exit');
        if (exitBtn) exitBtn.remove();
      }
    });
  }
}

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initI18n();
  initNavigation();
  initCronograma();
  initPomodoro();
  initRetencao();
  initHabitos();
  initDashboard();
  initExport();
  initImport();
  initPDF();
  initFocusMode();
});
