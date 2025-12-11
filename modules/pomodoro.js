// pomodoro.js
export class Pomodoro {
  constructor({focoMin=25, curtoMin=5, longoMin=15, onTick=null} = {}){
    this.foco = focoMin * 60;
    this.curto = curtoMin * 60;
    this.longo = longoMin * 60;
    this.onTick = onTick;
    this.timer = null;
    this.state = 'idle';
    this.ciclos = 0;
    this.remaining = this.foco;
  }
  format(s){
    const m = Math.floor(s/60).toString().padStart(2,'0');
    const ss = (s%60).toString().padStart(2,'0');
    return `${m}:${ss}`;
  }
  tick(){
    if(this.remaining <= 0){
      // transição
      if(this.state === 'focus'){ this.ciclos++; this.state = (this.ciclos % 4 === 0) ? 'long' : 'short'; this.remaining = (this.state==='long')?this.longo:this.curto; }
      else { this.state = 'focus'; this.remaining = this.foco; }
    } else {
      this.remaining--;
    }
    if(this.onTick) this.onTick(this.format(this.remaining), this.state);
  }
  start(){
    if(this.timer) return;
    if(this.state === 'idle') { this.state = 'focus'; this.remaining = this.foco; }
    this.timer = setInterval(()=>this.tick(), 1000);
  }
  stop(){
    clearInterval(this.timer); this.timer = null; this.state='idle'; this.remaining = this.foco; this.ciclos = 0;
    if(this.onTick) this.onTick(this.format(this.remaining), this.state);
  }
}