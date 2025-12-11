// habitos.js
export class Habitos {
  constructor(storageKey='habits'){
    this.key = storageKey;
    this.data = JSON.parse(localStorage.getItem(this.key) || '[]');
  }
  save(){ localStorage.setItem(this.key, JSON.stringify(this.data)); }
  add(name){
    const item = { id: Date.now(), name, history: {} }; // history keyed by date string
    this.data.push(item); this.save();
  }
  toggle(id){
    const item = this.data.find(x=>x.id===id);
    if(!item) return;
    const today = new Date().toISOString().slice(0,10);
    item.history[today] = !item.history[today];
    this.save();
  }
  getAll(){ return this.data; }
  render(container){
    container.innerHTML = '';
    this.data.forEach(h => {
      const div = document.createElement('div');
      div.className = 'habit';
      const checked = h.history[new Date().toISOString().slice(0,10)] ? '✅' : '⬜';
      div.innerHTML = `<button data-id="${h.id}" class="habit-btn">${checked}</button> <strong>${h.name}</strong>`;
      container.appendChild(div);
    });
    container.querySelectorAll('.habit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number(btn.getAttribute('data-id'));
        this.toggle(id);
        this.render(container);
      });
    });
  }
}