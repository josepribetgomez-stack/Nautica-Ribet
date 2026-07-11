(function () {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;
  const client = window.nauticaSupabase;
  const button = form.querySelector('button[type="submit"]');

  function showError(text) {
    let status = form.querySelector('[data-contact-status]');
    if (!status) {
      status = document.createElement('div');
      status.dataset.contactStatus = '';
      status.className = 'form-status';
      button.parentElement.appendChild(status);
    }
    status.style.display = 'block';
    status.style.background = '#fde8e7';
    status.style.color = '#9f2d24';
    status.textContent = text;
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const values = new FormData(form);
    if (values.get('_honey')) return;
    button.disabled = true;
    button.textContent = 'Guardando consulta…';
    const payload = {
      name: String(values.get('nombre') || '').trim(),
      email: String(values.get('email') || '').trim(),
      course: String(values.get('curso') || 'Otra consulta').trim(),
      phone: String(values.get('telefono') || '').trim() || null,
      message: String(values.get('mensaje') || '').trim()
    };
    const { error } = await client.from('contact_requests').insert(payload);
    if (error) {
      console.error(error);
      button.disabled = false;
      button.textContent = 'Enviar consulta';
      showError('No se ha podido registrar la consulta. Inténtalo de nuevo dentro de unos minutos.');
      return;
    }
    button.textContent = 'Enviando…';
    HTMLFormElement.prototype.submit.call(form);
  });
})();
