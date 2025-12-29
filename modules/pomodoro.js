// pomodoro.js - Pomodoro Timer com histórico e estatísticas
export class Pomodoro {
  constructor({focoMin=25, curtoMin=5, longoMin=15, onTick=null, onComplete=null} = {}){
    this.foco = focoMin * 60;
    this.curto = curtoMin * 60;
    this.longo = longoMin * 60;
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.timer = null;
    this.state = 'idle'; // idle, focus, short, long
    this.ciclos = 0;
    this.remaining = this.foco;
    this.storageKey = 'studium_pomodoro';
    this.loadStats();
  }

  loadStats() {
    try {
      const data = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
      this.stats = {
        totalCycles: data.totalCycles || 0,
        totalTime: data.totalTime || 0, // em minutos
        todayCycles: 0,
        history: data.history || {}
      };
      this.updateTodayStats();
    } catch (e) {
      this.stats = {
        totalCycles: 0,
        totalTime: 0,
        todayCycles: 0,
        history: {}
      };
    }
  }

  saveStats() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.stats));
  }

  updateTodayStats() {
    const today = new Date().toISOString().slice(0, 10);
    this.stats.todayCycles = this.stats.history[today]?.cycles || 0;
  }

  format(s){
    const m = Math.floor(s/60).toString().padStart(2,'0');
    const ss = (s%60).toString().padStart(2,'0');
    return `${m}:${ss}`;
  }

  getStateLabel() {
    const labels = {
      'idle': 'Pronto',
      'focus': 'Foco',
      'short': 'Pausa Curta',
      'long': 'Pausa Longa'
    };
    return labels[this.state] || 'Desconhecido';
  }

  tick(){
    if(this.remaining <= 0){
      // Ciclo completo
      if(this.state === 'focus'){
        this.ciclos++;
        this.recordCycle();
        
        // Determina próxima pausa
        if(this.ciclos % 4 === 0){
          this.state = 'long';
          this.remaining = this.longo;
        } else {
          this.state = 'short';
          this.remaining = this.curto;
        }
        
        if(this.onComplete) {
          this.onComplete(this.ciclos, this.state);
        }
      } else {
        // Pausa terminada, volta ao foco
        this.state = 'focus';
        this.remaining = this.foco;
      }
    } else {
      this.remaining--;
    }
    
    if(this.onTick) {
      this.onTick(this.format(this.remaining), this.getStateLabel());
    }
  }

  recordCycle() {
    const today = new Date().toISOString().slice(0, 10);
    if (!this.stats.history[today]) {
      this.stats.history[today] = { cycles: 0, time: 0 };
    }
    this.stats.history[today].cycles++;
    this.stats.history[today].time += this.foco / 60; // em minutos
    
    this.stats.totalCycles++;
    this.stats.totalTime += this.foco / 60;
    this.updateTodayStats();
    this.saveStats();
  }

  start(){
    if(this.timer) return;
    
    if(this.state === 'idle') {
      this.state = 'focus';
      this.remaining = this.foco;
    }
    
    this.timer = setInterval(() => this.tick(), 1000);
    this.tick(); // Primeira atualização imediata
  }

  stop(){
    if(this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  reset(){
    this.stop();
    this.state = 'idle';
    this.remaining = this.foco;
    this.ciclos = 0;
    if(this.onTick) {
      this.onTick(this.format(this.remaining), this.getStateLabel());
    }
  }

  getStats() {
    return {
      totalCycles: this.stats.totalCycles,
      totalTime: Math.round(this.stats.totalTime),
      todayCycles: this.stats.todayCycles,
      history: this.stats.history
    };
  }

  updateSettings(focoMin, curtoMin, longoMin) {
    const wasRunning = this.timer !== null;
    this.stop();
    
    this.foco = focoMin * 60;
    this.curto = curtoMin * 60;
    this.longo = longoMin * 60;
    
    if(this.state === 'idle' || this.state === 'focus') {
      this.remaining = this.foco;
    } else if(this.state === 'short') {
      this.remaining = this.curto;
    } else if(this.state === 'long') {
      this.remaining = this.longo;
    }
    
    if(this.onTick) {
      this.onTick(this.format(this.remaining), this.getStateLabel());
    }
    
    if(wasRunning) {
      this.start();
    }
  }
}
