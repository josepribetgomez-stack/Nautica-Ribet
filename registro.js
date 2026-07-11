(function () {
  const client = window.nauticaSupabase;
  const form = document.querySelector('[data-register-form]');
  const status = document.querySelector('[data-auth-status]');

  function message(text, error = false) {
    status.textContent = text;
    status.classList.toggle('error', error);
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    message('Enviando solicitud…');
    const values = new FormData(form);
    const { error } = await client.auth.signUp({
      email: values.get('email'),
      password: values.get('password')
    });
    if (error) {
      return message(error.message === 'User already registered' ? 'Ese correo ya está registrado. Utiliza la página de acceso.' : 'No se pudo enviar la solicitud. Revisa los datos.', true);
    }
    form.reset();
    message('Solicitud enviada. Revisa tu correo y confirma la cuenta. Después, el coordinador deberá activar tu acceso.');
  });
})();
