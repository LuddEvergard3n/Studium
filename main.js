// Tema (claro/escuro)
document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const toggle = document.getElementById("themeToggle");

    // Puxa tema salvo
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
        body.classList.add("dark-mode");
    }

    toggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");

        // Salva
        const isDark = body.classList.contains("dark-mode");
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });
});
import { gerarCronograma, dividirConteudo } from './modules/cronograma.js';
import { Pomodoro } from './modules/pomodoro.js';
import { calcularRetencao } from './modules/retencao.js';
import { Habitos } from './modules/habitos.js';
import { atualizarDashboard } from './modules/dashboard.js';

/* --- Cronograma --- */
document.getElementById('btnGerarCrono').addEventListener('click', () => {
  const dias = document.getElementById('diasHoras').value;
  const materias = document.getElementById('materiasInput').value;
  const cron = gerarCronograma(dias, materias);
  document.getElementById('cronogramaOutput').textContent = cron;
});

document.getElementById('btnDividirConteudo').addEventListener('click', () => {
  const materias = document.getElementById('materiasInput').value;
  const out = dividirConteudo(materias);
  document.getElementById('cronogramaOutput').textContent = out;
});

/* --- Pomodoro --- */
const pom = new Pomodoro({
  focoMin: Number(document.getElementById('pomFocus').value || 25),
  curtoMin: Number(document.getElementById('pomShort').value || 5),
  longoMin: Number(document.getElementById('pomLong').value || 15),
  onTick: (mmss, state) => {
    document.getElementById('pomDisplay').textContent = mmss;
    document.getElementById('pomState').textContent = state;
  }
});
document.getElementById('pomStart').addEventListener('click', () => pom.start());
document.getElementById('pomStop').addEventListener('click', () => pom.stop());

/* --- Retenção --- */
document.getElementById('btnCalcularRetencao').addEventListener('click', () => {
  const dias = Number(document.getElementById('diasDesdeRevisao').value || 0);
  const revisoes = Number(document.getElementById('revisoesFeitas').value || 0);
  const out = calcularRetencao(dias, revisoes);
  document.getElementById('retencaoOutput').textContent = out;
});

/* --- Hábitos --- */
const habitos = new Habitos('studium_habits');
habitos.render(document.getElementById('habitosList'));
document.getElementById('btnAddHabito').addEventListener('click', () => {
  const nome = document.getElementById('habitoNome').value.trim();
  if (!nome) return alert('Nome do hábito vazio');
  habitos.add(nome);
  habitos.render(document.getElementById('habitosList'));
  document.getElementById('habitoNome').value = '';
});

/* --- Dashboard --- */
document.getElementById('btnAtualizarDash').addEventListener('click', () => {
  atualizarDashboard(document.getElementById('dashStats'), habitos);
});

/* --- Export / Theme toggle --- */
document.getElementById('exportBtn').addEventListener('click', () => {
  const state = {
    cronograma_input: document.getElementById('materiasInput').value,
    dias_horas: document.getElementById('diasHoras').value,
    habitos: habitos.getAll()
  };
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'studium_backup.json'; a.click();
  URL.revokeObjectURL(url);
});

document.getElementById('themeToggle').addEventListener('click', () => {
  const isDark = document.documentElement.hasAttribute('data-theme-dark');
  if (isDark) {
    document.documentElement.removeAttribute('data-theme-dark');
    document.documentElement.style.color = '';
  } else {
    document.documentElement.setAttribute('data-theme-dark', '1');
  }
});