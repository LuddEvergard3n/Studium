// pdf-report.js - Gerador de relatório PDF
// Nota: Requer jsPDF (será adicionado via CDN no HTML)

export async function generatePDFReport(habitosInstance, pomodoroInstance, i18n) {
  // Carrega jsPDF dinamicamente
  if (typeof window.jspdf === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    document.head.appendChild(script);
    
    await new Promise((resolve) => {
      script.onload = resolve;
    });
  }
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const today = new Date();
  const dateStr = today.toLocaleDateString('pt-BR');
  
  // Cores
  const primaryColor = [99, 102, 241];
  const secondaryColor = [139, 92, 246];
  const successColor = [16, 185, 129];
  const textColor = [26, 26, 46];
  const lightGray = [229, 231, 235];
  
  let yPos = 20;
  
  // Cabeçalho
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('STUDIUM', 20, 25);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(i18n.t('performanceReport'), 20, 35);
  doc.text(dateStr, 170, 35, { align: 'right' });
  
  yPos = 50;
  doc.setTextColor(...textColor);
  
  // Estatísticas do Pomodoro
  if (pomodoroInstance) {
    const pomStats = pomodoroInstance.getStats();
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Pomodoro', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`${i18n.t('totalCycles')}: ${pomStats.totalCycles}`, 25, yPos);
    yPos += 6;
    doc.text(`${i18n.t('cyclesToday')}: ${pomStats.todayCycles}`, 25, yPos);
    yPos += 6;
    const hours = Math.floor(pomStats.totalTime / 60);
    const minutes = pomStats.totalTime % 60;
    doc.text(`${i18n.t('totalTime')}: ${hours}h ${minutes}min`, 25, yPos);
    yPos += 15;
  }
  
  // Hábitos
  const habits = habitosInstance.getAll();
  if (habits.length > 0) {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Hábitos', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const today = new Date().toISOString().slice(0, 10);
    let completedToday = 0;
    habits.forEach(h => {
      if (h.history && h.history[today]) completedToday++;
    });
    
    doc.text(`${i18n.t('habitsCompleted')}: ${completedToday}/${habits.length}`, 25, yPos);
    yPos += 6;
    
    // Lista de hábitos
    habits.forEach((habit, idx) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      const streak = habitosInstance.getStreak(habit.id);
      const completionRate = habitosInstance.getCompletionRate(habit.id);
      const checked = habit.history[today] ? '✓' : '○';
      
      doc.text(`${checked} ${habit.name}`, 30, yPos);
      doc.text(`   ${i18n.t('streak')}: ${streak} ${i18n.t('daysStreak')} | ${completionRate}%`, 30, yPos + 5);
      yPos += 12;
    });
    
    yPos += 10;
  }
  
  // Histórico de Pomodoro (últimos 7 dias)
  if (pomodoroInstance) {
    const stats = pomodoroInstance.getStats();
    const history = stats.history || {};
    const last7Days = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push(date.toISOString().slice(0, 10));
    }
    
    if (yPos > 200) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Histórico Semanal (Pomodoro)', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    last7Days.forEach(date => {
      const dayData = history[date] || { cycles: 0, time: 0 };
      const dayName = new Date(date).toLocaleDateString('pt-BR', { weekday: 'short' });
      doc.text(`${dayName} (${date}): ${dayData.cycles} ciclos, ${Math.round(dayData.time)}min`, 25, yPos);
      yPos += 6;
    });
  }
  
  // Rodapé
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`Página ${i} de ${pageCount}`, 105, 287, { align: 'center' });
    doc.text('STUDIUM - Sistema de Gestão de Estudos', 105, 292, { align: 'center' });
  }
  
  // Salva o PDF
  doc.save(`studium-report-${dateStr.replace(/\//g, '-')}.pdf`);
}

