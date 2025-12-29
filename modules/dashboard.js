// dashboard.js - Dashboard com hierarquia visual (Primário/Secundário/Histórico)
export function atualizarDashboard(container, habitosInstance, pomodoroInstance = null, i18n){
  if (!container) return;
  
  // Fallback para i18n se não fornecido
  if (!i18n || typeof i18n.t !== 'function') {
    i18n = {
      t: (key) => key,
      getLanguage: () => 'pt'
    };
  }
  
  // Verifica se as instâncias existem
  const habits = habitosInstance && typeof habitosInstance.getAll === 'function' ? habitosInstance.getAll() : [];
  const totalHabits = habits.length;
  const today = new Date().toISOString().slice(0,10);
  
  let completedToday = 0;
  let totalCompletions = 0;
  let totalStreak = 0;
  
  if (habitosInstance && typeof habitosInstance.getStreak === 'function') {
    habits.forEach(h => {
      if(h.history && h.history[today]) completedToday++;
      totalCompletions += Object.keys(h.history || {}).length;
      const streak = habitosInstance.getStreak(h.id);
      if (streak > totalStreak) totalStreak = streak;
    });
  }
  
  const pct = totalHabits ? Math.round((completedToday/totalHabits)*100) : 0;
  
  // Estatísticas do Pomodoro
  let pomStats = { totalCycles: 0, totalTime: 0, todayCycles: 0 };
  if (pomodoroInstance && typeof pomodoroInstance.getStats === 'function') {
    pomStats = pomodoroInstance.getStats();
  }
  
  // Histórico de hábitos (últimos 7 dias)
  const last7Days = [];
  const habitHistory = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().slice(0, 10);
    last7Days.push(dateStr);
    
    let dayCompletions = 0;
    if (habitosInstance) {
      habits.forEach(h => {
        if (h.history && h.history[dateStr]) dayCompletions++;
      });
    }
    habitHistory.push(dayCompletions);
  }
  
  const maxHabits = Math.max(...habitHistory, 1) || 1;
  
  // Determina status atual
  let currentStatus = i18n.t('ready');
  let statusColor = 'var(--color-blue)';
  if (pomodoroInstance && pomodoroInstance.state === 'focus') {
    currentStatus = i18n.t('studying');
    statusColor = 'var(--color-green)';
  } else if (pomodoroInstance && pomodoroInstance.state !== 'idle') {
    currentStatus = i18n.t('paused');
    statusColor = 'var(--color-yellow)';
  }
  
  // PRIMÁRIO - O que importa agora
  const hours = Math.floor(pomStats.totalTime / 60);
  const minutes = pomStats.totalTime % 60;
  const timeToday = pomStats.todayCycles * 25; // Assumindo 25min por ciclo
  
  container.innerHTML = `
    <!-- PRIMÁRIO -->
    <div class="card-primary">
      <div class="value" style="color: ${statusColor};">${currentStatus}</div>
      <div class="label">${i18n.t('currentStatus')}</div>
    </div>
    
    <div class="card-primary">
      <div class="value">${timeToday}min</div>
      <div class="label">${i18n.t('focusedTimeToday')}</div>
    </div>
    
    <!-- SECUNDÁRIO -->
    <div class="card-secondary">
      <div class="value">${completedToday}/${totalHabits}</div>
      <div class="label">${i18n.t('habitsCompleted')}</div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${pct}%"></div>
      </div>
    </div>
    
    <div class="card-secondary">
      <div class="value">${pomStats.todayCycles}</div>
      <div class="label">${i18n.t('pomodorosToday')}</div>
    </div>
    
    <div class="card-secondary">
      <div class="value">${totalStreak}</div>
      <div class="label">${i18n.t('streak')}</div>
    </div>
    
    <div class="card-secondary">
      <div class="value">${totalCompletions}</div>
      <div class="label">Total Completos</div>
    </div>
    
    <!-- HISTÓRICO -->
    <div class="card-historical">
      <div class="label">${i18n.t('weeklyProgress')}</div>
      <div class="chart-container">
        ${habitHistory.map((count, idx) => {
          const height = maxHabits > 0 ? (count / maxHabits) * 100 : 0;
          const date = new Date(last7Days[idx]);
          const dayName = date.toLocaleDateString(i18n.getLanguage() === 'pt' ? 'pt-BR' : i18n.getLanguage() === 'es' ? 'es-ES' : 'en-US', { weekday: 'short' });
          return `
            <div class="chart-bar" style="height: ${height}%" data-value="${count}" title="${dayName}: ${count}">
            </div>
          `;
        }).join('')}
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; font-size: 0.75rem; color: var(--text-secondary);">
        ${last7Days.map(date => {
          const d = new Date(date);
          return `<span>${d.toLocaleDateString(i18n.getLanguage() === 'pt' ? 'pt-BR' : i18n.getLanguage() === 'es' ? 'es-ES' : 'en-US', { weekday: 'short' })}</span>`;
        }).join('')}
      </div>
    </div>
  `;
}
