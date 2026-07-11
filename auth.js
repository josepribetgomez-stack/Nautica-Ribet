(function () {
  const client = window.nauticaSupabase;
  const loginPage = 'login.html';
  const masterEmail = 'josep.ribetgomez@gmail.com';

  function destination() {
    return encodeURIComponent(location.pathname.split('/').pop() + location.search + location.hash);
  }

  async function profileFor(userId) {
    const { data, error } = await client.from('profiles').select('id,email,role,active,created_at').eq('id', userId).single();
    if (error) throw error;
    return data;
  }

  async function requireAccess(options = {}) {
    const { data: { session } } = await client.auth.getSession();
    if (!session) {
      location.replace(`${loginPage}?next=${destination()}`);
      return null;
    }
    try {
      const profile = await profileFor(session.user.id);
      const isCoordinator = profile.role === 'admin' || String(session.user.email || profile.email).toLowerCase() === masterEmail;
      if (!profile.active && !isCoordinator) {
        await client.auth.signOut();
        location.replace(`${loginPage}?estado=pendiente`);
        return null;
      }
      if (options.admin && !isCoordinator) {
        location.replace('baterias-test.html');
        return null;
      }
      if (isCoordinator) {
        profile.role = 'admin';
        profile.active = true;
      }
      document.body.style.visibility = 'visible';
      document.dispatchEvent(new CustomEvent('nautica:authenticated', { detail: { session, profile } }));
      return { session, profile };
    } catch (error) {
      console.error(error);
      location.replace(`${loginPage}?estado=error`);
      return null;
    }
  }

  async function signOut() {
    await client.auth.signOut();
    location.replace(loginPage);
  }

  window.NauticaAuth = { client, profileFor, requireAccess, signOut, masterEmail };

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-sign-out]').forEach(button => button.addEventListener('click', signOut));
    if (document.body.matches('[data-protected]')) {
      requireAccess({ admin: document.body.matches('[data-require-admin]') });
    }
  });
})();
