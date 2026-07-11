(function () {
  const client = window.nauticaSupabase;
  const list = document.querySelector('[data-user-list]');
  const status = document.querySelector('[data-admin-status]');

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
  document.addEventListener('nautica:authenticated', loadUsers);
  document.querySelector('[data-refresh-users]').addEventListener('click', loadUsers);
})();
