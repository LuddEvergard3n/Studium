// i18n.js - Sistema de internacionalização
const translations = {
  pt: {
    // Geral
    appName: 'STUDIUM',
    appSubtitle: 'Sistema Universal de Estudos e Métricas',
    export: 'Exportar',
    import: 'Importar',
    save: 'Salvar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    close: 'Fechar',
    delete: 'Remover',
    update: 'Atualizar',
    add: 'Adicionar',
    start: 'Iniciar',
    stop: 'Parar',
    reset: 'Resetar',
    
    // Navegação
    dashboard: 'Dashboard',
    schedule: 'Cronograma',
    pomodoro: 'Pomodoro',
    habits: 'Hábitos',
    retention: 'Retenção',
    
    // Dashboard
    nextStudySession: 'Próxima Sessão',
    focusedTimeToday: 'Tempo Focado Hoje',
    currentStatus: 'Status Atual',
    pomodorosToday: 'Pomodoros Hoje',
    habitsCompleted: 'Hábitos Completos',
    weeklyProgress: 'Progresso Semanal',
    streak: 'Sequência',
    totalCycles: 'Total de Ciclos',
    totalTime: 'Tempo Total',
    minutes: 'minutos',
    hours: 'horas',
    
    // Status
    studying: 'Estudando',
    paused: 'Pausado',
    behind: 'Em Atraso',
    ready: 'Pronto',
    focus: 'Foco',
    shortBreak: 'Pausa Curta',
    longBreak: 'Pausa Longa',
    
    // Cronograma
    hoursPerDay: 'Horas disponíveis por dia',
    subjects: 'Matérias',
    generateSchedule: 'Gerar Cronograma',
    divideContent: 'Dividir Conteúdo',
    formatExample: 'Formato: Nome:Prioridade:TotalHoras',
    example: 'Ex: História:2:40;Inglês:1:30',
    
    // Pomodoro
    focusTime: 'Foco (min)',
    shortBreak: 'Pausa Curta (min)',
    longBreak: 'Pausa Longa (min)',
    cyclesToday: 'Ciclos Hoje',
    totalCycles: 'Total de Ciclos',
    focusedTime: 'Tempo Focado',
    
    // Hábitos
    habitName: 'Nome do hábito',
    addHabit: 'Adicionar Hábito',
    noHabits: 'Comece adicionando seu primeiro hábito acadêmico',
    daysStreak: 'dias',
    completionRate: 'completos (30d)',
    
    // Retenção
    lastReview: 'Última revisão (dias atrás)',
    reviewsDone: 'Número de revisões feitas',
    calculateRetention: 'Calcular Retenção',
    estimatedRetention: 'Retenção Estimada',
    nextReview: 'Próxima revisão recomendada',
    
    // Mensagens
    habitNameRequired: 'Por favor, digite um nome para o hábito.',
    deleteHabitConfirm: 'Tem certeza que deseja remover este hábito?',
    exportSuccess: 'Dados exportados com sucesso!',
    importSuccess: 'Dados importados com sucesso!',
    importError: 'Erro ao importar dados. Verifique o arquivo.',
    noDataToExport: 'Nenhum dado para exportar.',
    
    // PDF
    performanceReport: 'Relatório de Desempenho',
    generatePDF: 'Gerar Relatório PDF',
    
    // Empty states
    noHabitsYet: 'Comece adicionando seu primeiro hábito acadêmico',
    noScheduleYet: 'Configure seu cronograma semanal para começar',
    
    // Footer
    footerText: 'STUDIUM • Sistema de gestão de estudos • Dados salvos localmente',
    
    // Adicionais
    today: 'Hoje',
    daysAgo: 'dia(s) atrás',
    days: 'dia(s)',
    excellent: 'Excelente',
    good: 'Boa',
    moderate: 'Moderada',
    lowUrgent: 'Baixa - Revisão Urgente!',
    noSubjects: 'Nenhuma matéria válida detectada',
    noHours: 'Nenhuma hora disponível na semana',
    noSubjectsToDivide: 'Nenhuma matéria para dividir',
    theme: 'Alternar tema',
    focusMode: 'Modo Foco'
  },
  
  en: {
    appName: 'STUDIUM',
    appSubtitle: 'Universal Study and Metrics System',
    export: 'Export',
    import: 'Import',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    close: 'Close',
    delete: 'Delete',
    update: 'Update',
    add: 'Add',
    start: 'Start',
    stop: 'Stop',
    reset: 'Reset',
    dashboard: 'Dashboard',
    schedule: 'Schedule',
    pomodoro: 'Pomodoro',
    habits: 'Habits',
    retention: 'Retention',
    nextStudySession: 'Next Session',
    focusedTimeToday: 'Focused Time Today',
    currentStatus: 'Current Status',
    pomodorosToday: 'Pomodoros Today',
    habitsCompleted: 'Habits Completed',
    weeklyProgress: 'Weekly Progress',
    streak: 'Streak',
    totalCycles: 'Total Cycles',
    totalTime: 'Total Time',
    minutes: 'minutes',
    hours: 'hours',
    studying: 'Studying',
    paused: 'Paused',
    behind: 'Behind',
    ready: 'Ready',
    focus: 'Focus',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
    hoursPerDay: 'Available hours per day',
    subjects: 'Subjects',
    generateSchedule: 'Generate Schedule',
    divideContent: 'Divide Content',
    formatExample: 'Format: Name:Priority:TotalHours',
    example: 'Ex: History:2:40;English:1:30',
    focusTime: 'Focus (min)',
    shortBreak: 'Short Break (min)',
    longBreak: 'Long Break (min)',
    cyclesToday: 'Cycles Today',
    totalCycles: 'Total Cycles',
    focusedTime: 'Focused Time',
    habitName: 'Habit name',
    addHabit: 'Add Habit',
    noHabits: 'Start by adding your first academic habit',
    daysStreak: 'days',
    completionRate: 'complete (30d)',
    lastReview: 'Last review (days ago)',
    reviewsDone: 'Number of reviews done',
    calculateRetention: 'Calculate Retention',
    estimatedRetention: 'Estimated Retention',
    nextReview: 'Next recommended review',
    habitNameRequired: 'Please enter a habit name.',
    deleteHabitConfirm: 'Are you sure you want to remove this habit?',
    exportSuccess: 'Data exported successfully!',
    importSuccess: 'Data imported successfully!',
    importError: 'Error importing data. Please check the file.',
    noDataToExport: 'No data to export.',
    performanceReport: 'Performance Report',
    generatePDF: 'Generate PDF Report',
    noHabitsYet: 'Start by adding your first academic habit',
    noScheduleYet: 'Configure your weekly schedule to get started',
    footerText: 'STUDIUM • Study management system • Data saved locally',
    today: 'Today',
    daysAgo: 'day(s) ago',
    days: 'day(s)',
    excellent: 'Excellent',
    good: 'Good',
    moderate: 'Moderate',
    lowUrgent: 'Low - Urgent Review!',
    noSubjects: 'No valid subjects detected',
    noHours: 'No hours available this week',
    noSubjectsToDivide: 'No subjects to divide',
    theme: 'Toggle theme',
    focusMode: 'Focus Mode'
  },
  
  es: {
    appName: 'STUDIUM',
    appSubtitle: 'Sistema Universal de Estudios y Métricas',
    export: 'Exportar',
    import: 'Importar',
    save: 'Guardar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    close: 'Cerrar',
    delete: 'Eliminar',
    update: 'Actualizar',
    add: 'Agregar',
    start: 'Iniciar',
    stop: 'Detener',
    reset: 'Reiniciar',
    dashboard: 'Panel',
    schedule: 'Cronograma',
    pomodoro: 'Pomodoro',
    habits: 'Hábitos',
    retention: 'Retención',
    nextStudySession: 'Próxima Sesión',
    focusedTimeToday: 'Tiempo Enfocado Hoy',
    currentStatus: 'Estado Actual',
    pomodorosToday: 'Pomodoros Hoy',
    habitsCompleted: 'Hábitos Completados',
    weeklyProgress: 'Progreso Semanal',
    streak: 'Racha',
    totalCycles: 'Ciclos Totales',
    totalTime: 'Tiempo Total',
    minutes: 'minutos',
    hours: 'horas',
    studying: 'Estudiando',
    paused: 'Pausado',
    behind: 'Atrasado',
    ready: 'Listo',
    focus: 'Enfoque',
    shortBreak: 'Pausa Corta',
    longBreak: 'Pausa Larga',
    hoursPerDay: 'Horas disponibles por día',
    subjects: 'Materias',
    generateSchedule: 'Generar Cronograma',
    divideContent: 'Dividir Contenido',
    formatExample: 'Formato: Nombre:Prioridad:TotalHoras',
    example: 'Ej: Historia:2:40;Inglés:1:30',
    focusTime: 'Enfoque (min)',
    shortBreak: 'Pausa Corta (min)',
    longBreak: 'Pausa Larga (min)',
    cyclesToday: 'Ciclos Hoy',
    totalCycles: 'Ciclos Totales',
    focusedTime: 'Tiempo Enfocado',
    habitName: 'Nombre del hábito',
    addHabit: 'Agregar Hábito',
    noHabits: 'Comienza agregando tu primer hábito académico',
    daysStreak: 'días',
    completionRate: 'completados (30d)',
    lastReview: 'Última revisión (días atrás)',
    reviewsDone: 'Número de revisiones realizadas',
    calculateRetention: 'Calcular Retención',
    estimatedRetention: 'Retención Estimada',
    nextReview: 'Próxima revisión recomendada',
    habitNameRequired: 'Por favor, ingrese un nombre para el hábito.',
    deleteHabitConfirm: '¿Está seguro de que desea eliminar este hábito?',
    exportSuccess: 'Datos exportados con éxito!',
    importSuccess: 'Datos importados con éxito!',
    importError: 'Error al importar datos. Verifique el archivo.',
    noDataToExport: 'No hay datos para exportar.',
    performanceReport: 'Informe de Rendimiento',
    generatePDF: 'Generar Informe PDF',
    noHabitsYet: 'Comienza agregando tu primer hábito académico',
    noScheduleYet: 'Configura tu cronograma semanal para comenzar',
    footerText: 'STUDIUM • Sistema de gestión de estudios • Datos guardados localmente',
    today: 'Hoy',
    daysAgo: 'día(s) atrás',
    days: 'día(s)',
    excellent: 'Excelente',
    good: 'Buena',
    moderate: 'Moderada',
    lowUrgent: 'Baja - Revisión Urgente!',
    noSubjects: 'No se detectaron materias válidas',
    noHours: 'No hay horas disponibles esta semana',
    noSubjectsToDivide: 'No hay materias para dividir',
    theme: 'Alternar tema',
    focusMode: 'Modo Enfoque'
  }
};

let currentLang = localStorage.getItem('studium_lang') || 'pt';

export const i18n = {
  setLanguage(lang) {
    if (translations[lang]) {
      currentLang = lang;
      localStorage.setItem('studium_lang', lang);
      this.updateUI();
    }
  },
  
  getLanguage() {
    return currentLang;
  },
  
  t(key, fallback = '') {
    return translations[currentLang]?.[key] || translations['pt']?.[key] || fallback || key;
  },
  
  updateUI() {
    // Atualiza todos os textos da interface
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = this.t(key);
    });
    
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      el.title = this.t(key);
    });
  }
};

