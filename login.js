(function () {
  const client = window.nauticaSupabase;
  const status = document.querySelector('[data-auth-status]');
  const loginForm = document.querySelector('[data-login-form]');
  const registerForm = document.querySelector('[data-register-form]');
  const params = new URLSearchParams(location.search);
  const safeNext = params.get('next') && !params.get('next').includes('://') ? params.get('next') : 'baterias-test.html';

  function message(text, error = false) {
    status.textContent = text;
    status.classList.toggle('error', error);
  }
  if (params.get('estado') === 'pendiente') message('Tu cuenta está pendiente de activación por el coordinador.');
  if (params.get('estado') === 'error') message('No se pudo comprobar el acceso. Inténtalo de nuevo.', true);

  document.querySelectorAll('[data-auth-tab]').forEach(button => button.addEventListener('click', () => {
    const login = button.dataset.authTab === 'login';
    document.querySelectorAll('[data-auth-tab]').forEach(tab => tab.classList.toggle('active', tab === button));
    loginForm.hidden = !login; registerForm.hidden = login; message('');
  }));

  loginForm.addEventListener('submit', async event => {
    event.preventDefault(); message('Comprobando acceso…');
    const values = new FormData(loginForm);
    const { data, error } = await client.auth.signInWithPassword({ email: values.get('email'), password: values.get('password') });
    if (error) return message('Correo o contraseña incorrectos.', true);
    const { data: profile, error: profileError } = await client.from('profiles').select('active,role').eq('id', data.user.id).single();
    if (profileError || !profile?.active) { await client.auth.signOut(); return message('Tu cuenta todavía no ha sido activada por el coordinador.', true); }
    location.replace(profile.role === 'admin' && safeNext === 'baterias-test.html' ? 'admin.html' : safeNext);
  });

  registerForm.addEventListener('submit', async event => {
    event.preventDefault(); message('Creando tu cuenta…');
    const values = new FormData(registerForm);
    const { error } = await client.auth.signUp({ email: values.get('email'), password: values.get('password') });
    if (error) return message(error.message === 'User already registered' ? 'Ese correo ya está registrado.' : 'No se pudo crear la cuenta. Revisa los datos.', true);
    registerForm.reset(); message('Cuenta creada. Revisa tu correo si recibes una confirmación. Después, el coordinador deberá activar tu acceso.');
  });
})();
