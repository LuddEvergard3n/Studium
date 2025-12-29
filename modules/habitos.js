// habitos.js - Sistema de hábitos (sem emojis, mais visual)
export class Habitos {
  constructor(storageKey='studium_habits'){
    this.key = storageKey;
    this.data = JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  save(){
    localStorage.setItem(this.key, JSON.stringify(this.data));
  }

  add(name){
    if (!name || !name.trim()) return false;
    const item = {
      id: Date.now(),
      name: name.trim(),
      history: {},
      createdAt: new Date().toISOString()
    };
    this.data.push(item);
    this.save();
    return true;
  }

  remove(id){
    this.data = this.data.filter(x => x.id !== id);
    this.save();
  }

  toggle(id, date = null){
    const item = this.data.find(x => x.id === id);
    if(!item) return;
    
    if (!date) {
      date = new Date().toISOString().slice(0, 10);
    }
    
    item.history[date] = !item.history[date];
    if (!item.history[date]) {
      delete item.history[date];
    }
    this.save();
  }

  getStreak(id) {
    const item = this.data.find(x => x.id === id);
    if (!item) return 0;
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().slice(0, 10);
      
      if (item.history[dateStr]) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  }

  getCompletionRate(id, days = 30) {
    const item = this.data.find(x => x.id === id);
    if (!item) return 0;
    
    let completed = 0;
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().slice(0, 10);
      if (item.history[dateStr]) completed++;
    }
    
    return Math.round((completed / days) * 100);
  }

  getAll(){
    return this.data;
  }

  getLast30Days() {
    const days = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().slice(0, 10));
    }
    return days;
  }

  render(container, i18n = null){
    container.innerHTML = '';
    
    if (this.data.length === 0) {
      container.innerHTML = `<div class="empty-state"><p>${i18n ? i18n.t('noHabitsYet') : 'Comece adicionando seu primeiro hábito acadêmico'}</p></div>`;
      return;
    }

    const last30Days = this.getLast30Days();
    const today = new Date().toISOString().slice(0, 10);
    
    this.data.forEach(h => {
      const div = document.createElement('div');
      div.className = 'habit-item';
      
      const checked = h.history[today] || false;
      const streak = this.getStreak(h.id);
      const completionRate = this.getCompletionRate(h.id);
      
      div.innerHTML = `
        <button class="habit-btn ${checked ? 'checked' : ''}" data-id="${h.id}" title="${checked ? 'Desmarcar' : 'Marcar'}">
          ${checked ? '✓' : ''}
        </button>
        <div style="flex: 1;">
          <div class="habit-name">${h.name}</div>
          <div style="display: flex; gap: 1rem; margin-top: 0.5rem; font-size: 0.75rem; color: var(--text-secondary);">
            <span>${streak} ${i18n ? i18n.t('daysStreak', 'dias') : 'dias'}</span>
            <span>${completionRate}% ${i18n ? i18n.t('completionRate', 'completos (30d)') : 'completos (30d)'}</span>
          </div>
        </div>
        <button class="habit-btn danger small" data-remove="${h.id}" title="${i18n ? i18n.t('delete', 'Remover') : 'Remover'}">×</button>
      `;
      
      const calendarDiv = document.createElement('div');
      calendarDiv.className = 'habit-calendar';
      calendarDiv.style.marginTop = '1rem';
      
      last30Days.forEach((date, idx) => {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        if (h.history[date]) {
          dayDiv.classList.add('completed');
        }
        if (date === today) {
          dayDiv.classList.add('today');
        }
        dayDiv.textContent = new Date(date).getDate();
        dayDiv.title = `${date}: ${h.history[date] ? 'Completo' : 'Incompleto'}`;
        calendarDiv.appendChild(dayDiv);
      });
      
      div.appendChild(calendarDiv);
      container.appendChild(div);
    });

    container.querySelectorAll('.habit-btn[data-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number(btn.getAttribute('data-id'));
        this.toggle(id);
        btn.classList.add('checkmark-animation');
        setTimeout(() => {
          this.render(container, i18n);
        }, 300);
      });
    });

    container.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number(btn.getAttribute('data-remove'));
        if (i18n) {
          // Usar modal ao invés de confirm
          import('./modal.js').then(({ Modal }) => {
            Modal.confirm(i18n.t('deleteHabitConfirm'), i18n.t('confirm', 'Confirmar')).then(confirmed => {
              if (confirmed) {
                this.remove(id);
                this.render(container, i18n);
              }
            });
          });
        } else {
          if (confirm('Tem certeza que deseja remover este hábito?')) {
            this.remove(id);
            this.render(container, i18n);
          }
        }
      });
    });
  }
}
