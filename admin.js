(function () {
  const client = window.nauticaSupabase;
  const list = document.querySelector('[data-user-list]');
  const status = document.querySelector('[data-admin-status]');
  const contactList = document.querySelector('[data-contact-list]');
  const contactStatus = document.querySelector('[data-contact-status]');
  const contactFilter = document.querySelector('[data-contact-filter]');

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  }
  async function loadUsers() {
    status.textContent = '';
    const { data, error } = await client.from('profiles').select('id,email,role,active,created_at').order('created_at', { ascending: false });
    if (error) { list.innerHTML = '<p>No se pudieron cargar los usuarios.</p>'; return; }
    list.innerHTML = data.map(user => `<div class="user-row"><div><strong>${escapeHtml(user.email)}</strong><small>${user.role === 'admin' ? 'Coordinador' : 'Alumno'} · ${new Date(user.created_at).toLocaleDateString('es-ES')}</small></div><label class="access-switch"><input type="checkbox" data-user-toggle="${user.id}" ${user.active ? 'checked' : ''} ${user.role === 'admin' ? 'disabled' : ''}><span>${user.active ? 'Activo' : 'Desactivado'}</span></label></div>`).join('') || '<p>Aún no hay usuarios registrados.</p>';
    list.querySelectorAll('[data-user-toggle]').forEach(toggle => toggle.addEventListener('change', async () => {
      toggle.disabled = true;
      const active = toggle.checked;
      const { error: updateError } = await client.from('profiles').update({ active }).eq('id', toggle.dataset.userToggle);
      if (updateError) { toggle.checked = !active; status.textContent = 'No se pudo guardar el cambio.'; }
      else status.textContent = active ? 'Acceso activado.' : 'Acceso desactivado.';
      await loadUsers();
    }));
  }
  const statusLabels = { new: 'Nueva', pending: 'Pendiente', answered: 'Respondida', archived: 'Archivada' };
  async function loadContacts() {
    contactStatus.textContent = '';
    let query = client.from('contact_requests').select('id,name,email,course,phone,message,status,notes,created_at').order('created_at', { ascending: false });
    if (contactFilter.value !== 'all') query = query.eq('status', contactFilter.value);
    const { data, error } = await query;
    if (error) { contactList.innerHTML = '<p>No se pudieron cargar las consultas.</p>'; return; }
    contactList.innerHTML = data.map(item => `<article class="contact-item" data-contact-id="${item.id}"><div class="contact-heading"><div><span class="contact-badge status-${item.status}">${statusLabels[item.status]}</span><h3>${escapeHtml(item.name)}</h3><small>${new Date(item.created_at).toLocaleString('es-ES')} · ${escapeHtml(item.course)}</small></div><select data-contact-state aria-label="Estado de la consulta"><option value="new" ${item.status === 'new' ? 'selected' : ''}>Nueva</option><option value="pending" ${item.status === 'pending' ? 'selected' : ''}>Pendiente</option><option value="answered" ${item.status === 'answered' ? 'selected' : ''}>Respondida</option><option value="archived" ${item.status === 'archived' ? 'selected' : ''}>Archivada</option></select></div><div class="contact-data"><a href="mailto:${escapeHtml(item.email)}">${escapeHtml(item.email)}</a>${item.phone ? `<a href="tel:${escapeHtml(item.phone)}">${escapeHtml(item.phone)}</a>` : ''}</div><p class="contact-message">${escapeHtml(item.message)}</p><label>Notas privadas<textarea data-contact-notes maxlength="5000" placeholder="Seguimiento, acuerdos o recordatorios…">${escapeHtml(item.notes || '')}</textarea></label><button class="btn btn-secondary btn-sm" data-save-contact>Guardar cambios</button></article>`).join('') || '<p>No hay consultas en esta categoría.</p>';
    contactList.querySelectorAll('[data-save-contact]').forEach(button => button.addEventListener('click', async () => {
      const item = button.closest('[data-contact-id]');
      button.disabled = true;
      const { error: updateError } = await client.from('contact_requests').update({ status: item.querySelector('[data-contact-state]').value, notes: item.querySelector('[data-contact-notes]').value.trim() || null }).eq('id', Number(item.dataset.contactId));
      contactStatus.style.display = 'block';
      contactStatus.textContent = updateError ? 'No se pudieron guardar los cambios.' : 'Consulta actualizada.';
      await loadContacts();
    }));
  }

  document.addEventListener('nautica:authenticated', () => { loadUsers(); loadContacts(); });
  document.querySelector('[data-refresh-users]').addEventListener('click', loadUsers);
  document.querySelector('[data-refresh-contacts]').addEventListener('click', loadContacts);
  contactFilter.addEventListener('change', loadContacts);
})();
