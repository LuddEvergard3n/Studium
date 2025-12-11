// dashboard.js
export function atualizarDashboard(container, habitosInstance){
  const habits = habitosInstance.getAll();
  const totalHabits = habits.length;
  let completedToday = 0;
  const today = new Date().toISOString().slice(0,10);
  habits.forEach(h => { if(h.history && h.history[today]) completedToday++; });
  const pct = totalHabits ? Math.round((completedToday/totalHabits)*100) : 0;
  container.innerHTML = `
    Total de hábitos: ${totalHabits}\n
    Completos hoje: ${completedToday}\n
    Progresso de hábitos hoje: ${pct}%\n
    (Pomodoro: use a aba Pomodoro para registrar ciclos)\n
    (Cronograma: gere seu plano semanal para ver distribuições)
  `;
}