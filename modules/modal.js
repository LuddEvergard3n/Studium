// modal.js - Sistema de modais nativos
export class Modal {
  constructor(options = {}) {
    this.id = options.id || `modal-${Date.now()}`;
    this.title = options.title || '';
    this.content = options.content || '';
    this.buttons = options.buttons || [];
    this.onClose = options.onClose || null;
    this.closable = options.closable !== false;
  }

  show() {
    // Remove modal existente se houver
    const existing = document.getElementById(this.id);
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = this.id;
    
    modal.innerHTML = `
      <div class="modal-container">
        ${this.title ? `<div class="modal-header"><h3>${this.title}</h3></div>` : ''}
        <div class="modal-body">${this.content}</div>
        ${this.buttons.length > 0 ? `
          <div class="modal-footer">
            ${this.buttons.map(btn => `
              <button class="modal-btn ${btn.class || ''}" data-action="${btn.action || ''}">
                ${btn.label || 'OK'}
              </button>
            `).join('')}
          </div>
        ` : ''}
        ${this.closable ? '<button class="modal-close">&times;</button>' : ''}
      </div>
    `;

    document.body.appendChild(modal);
    
    // Anima entrada
    setTimeout(() => modal.classList.add('active'), 10);

    // Event listeners
    const closeModal = (result = null) => {
      modal.classList.remove('active');
      setTimeout(() => {
        modal.remove();
        if (this.onClose) this.onClose(result);
      }, 300);
    };

    modal.querySelectorAll('.modal-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        closeModal(action);
      });
    });

    if (this.closable) {
      modal.querySelector('.modal-close').addEventListener('click', () => closeModal('close'));
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal('backdrop');
      });
    }

    // ESC para fechar
    const escHandler = (e) => {
      if (e.key === 'Escape' && this.closable) {
        closeModal('escape');
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }

  static alert(message, title = 'Aviso') {
    return new Promise((resolve) => {
      new Modal({
        title,
        content: `<p>${message}</p>`,
        buttons: [{ label: 'OK', action: 'ok' }],
        onClose: () => resolve()
      }).show();
    });
  }

  static confirm(message, title = 'Confirmar') {
    return new Promise((resolve) => {
      new Modal({
        title,
        content: `<p>${message}</p>`,
        buttons: [
          { label: 'Cancelar', action: 'cancel', class: 'secondary' },
          { label: 'Confirmar', action: 'confirm' }
        ],
        onClose: (action) => resolve(action === 'confirm')
      }).show();
    });
  }

  static prompt(message, defaultValue = '', title = 'Entrada') {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = defaultValue;
      input.className = 'modal-input';
      input.style.width = '100%';
      input.style.marginTop = '1rem';
      
      const modal = new Modal({
        title,
        content: `<p>${message}</p>`,
        buttons: [
          { label: 'Cancelar', action: 'cancel', class: 'secondary' },
          { label: 'OK', action: 'ok' }
        ],
        onClose: (action) => {
          resolve(action === 'ok' ? input.value : null);
        }
      });
      
      modal.show();
      
      // Adiciona input após mostrar
      setTimeout(() => {
        const body = document.querySelector(`#${modal.id} .modal-body`);
        body.appendChild(input);
        input.focus();
        input.select();
        
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            document.querySelector(`#${modal.id} .modal-btn[data-action="ok"]`).click();
          }
        });
      }, 50);
    });
  }
}

