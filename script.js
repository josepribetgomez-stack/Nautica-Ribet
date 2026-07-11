const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú');
  }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menú');
      menuToggle.focus();
    }
  });
}

document.querySelectorAll('.faq-question').forEach(button => {
  button.setAttribute('aria-expanded', String(button.closest('.faq-item').classList.contains('open')));
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const isOpen = item.classList.toggle('open');
    button.setAttribute('aria-expanded', String(isOpen));
  });
});

const toast = document.querySelector('.toast');
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 3800);
}

document.querySelectorAll('[data-checkout]').forEach(button => {
  button.addEventListener('click', event => {
    event.preventDefault();
    showToast('Pago todavía no conectado. Sustituye este botón por tu enlace de Stripe o WooCommerce.');
  });
});

document.querySelectorAll('[data-demo-form]').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const status = form.querySelector('.form-status');
    if (status) {
      status.style.display = 'block';
      status.textContent = 'Formulario de demostración completado. Para recibir mensajes, conéctalo a tu correo o CRM.';
    }
    form.reset();
  });
});

const cookieBanner = document.querySelector('.cookie-banner');
function getCookieChoice() {
  try { return localStorage.getItem('cookieChoice'); }
  catch { return null; }
}
function saveCookieChoice(choice) {
  try { localStorage.setItem('cookieChoice', choice); }
  catch { /* The site still works when storage is blocked. */ }
}
if (cookieBanner && !getCookieChoice()) {
  window.setTimeout(() => cookieBanner.classList.add('show'), 700);
}
document.querySelectorAll('[data-cookie]').forEach(button => {
  button.addEventListener('click', () => {
    saveCookieChoice(button.dataset.cookie);
    cookieBanner?.classList.remove('show');
  });
});

// Free PER diagnostic quiz
const quizRoot = document.querySelector('[data-quiz]');
if (quizRoot) {
  const questions = [
    {q:'¿Qué costado de una embarcación corresponde a babor?', a:['El derecho mirando hacia proa','El izquierdo mirando hacia proa','El derecho mirando hacia popa','Depende del rumbo'], c:1},
    {q:'Una marca cardinal Norte indica que las aguas navegables están:', a:['Al norte de la marca','Al sur de la marca','Al este de la marca','En cualquier dirección'], c:0},
    {q:'En una situación de vuelta encontrada entre dos buques de propulsión mecánica:', a:['Ambos caen a babor','Ambos caen a estribor','Mantiene rumbo el más rápido','Cae a estribor solo el de menor eslora'], c:1},
    {q:'La señal MAYDAY se emplea para:', a:['Un mensaje meteorológico','Una urgencia sin peligro grave','Peligro grave e inminente','Una llamada rutinaria'], c:2},
    {q:'El nudo es una unidad de:', a:['Distancia','Velocidad','Presión','Profundidad'], c:1},
    {q:'Una milla náutica equivale aproximadamente a:', a:['1.000 m','1.500 m','1.852 m','2.000 m'], c:2},
    {q:'La luz roja de costado se muestra en:', a:['Babor','Estribor','Popa','Tope'], c:0},
    {q:'La acción inicial recomendada tras una caída de persona al agua incluye:', a:['Aumentar velocidad','Dar la voz de alarma y mantener contacto visual','Apagar toda la electrónica','Fondear inmediatamente'], c:1},
    {q:'El instrumento que mide la presión atmosférica es:', a:['Anemómetro','Barómetro','Higrómetro','Corredera'], c:1},
    {q:'La declinación magnética es el ángulo entre:', a:['Rumbo y demora','Norte verdadero y norte magnético','Norte magnético y norte de aguja','Proa y popa'], c:1},
    {q:'Una embarcación sin gobierno muestra de noche:', a:['Dos luces rojas todo horizonte en vertical','Dos luces verdes en vertical','Una luz blanca intermitente','Tres luces rojas en vertical'], c:0},
    {q:'La finalidad principal del fondeo es:', a:['Aumentar la velocidad','Mantener la embarcación sujeta al fondo','Medir la profundidad','Corregir el compás'], c:1},
    {q:'En la carta náutica, la latitud se mide:', a:['Desde Greenwich hacia este u oeste','Desde el ecuador hacia norte o sur','Desde el polo norte únicamente','En millas por hora'], c:1},
    {q:'Un frente frío suele asociarse con:', a:['Ausencia total de viento','Cambios de tiempo y posibles chubascos','Mareas muertas','Menor presión del agua'], c:1},
    {q:'La velocidad de seguridad debe permitir:', a:['Navegar siempre a máxima potencia','Adoptar medidas eficaces y detenerse a distancia apropiada','No usar el radar','Evitar cualquier cambio de rumbo'], c:1},
    {q:'La corrección total relaciona:', a:['Rumbo verdadero y rumbo de aguja','Velocidad y distancia','Latitud y longitud','Sonda y marea'], c:0},
    {q:'Una marca lateral de estribor, en región IALA A, es normalmente:', a:['Roja','Verde','Amarilla','Negra y amarilla'], c:1},
    {q:'El extintor apropiado debe emplearse:', a:['Sin valorar el tipo de fuego','Según la clase de fuego y las instrucciones del equipo','Solo desde sotavento','Después de abrir todos los compartimentos'], c:1},
    {q:'La demora es el ángulo medido desde:', a:['Una dirección de referencia hasta la visual del objeto','La popa hasta la proa','La vertical hasta el horizonte','La línea de flotación'], c:0},
    {q:'Antes de salir a navegar es importante comprobar:', a:['Solo el combustible','Meteorología, equipo, documentación y planificación','Únicamente el teléfono móvil','Solo el estado de la pintura'], c:1}
  ];
  let index = 0;
  let answers = new Array(questions.length).fill(null);
  const questionEl = quizRoot.querySelector('[data-question]');
  const optionsEl = quizRoot.querySelector('[data-options]');
  const counterEl = quizRoot.querySelector('[data-counter]');
  const progressEl = quizRoot.querySelector('[data-progress]');
  const prevBtn = quizRoot.querySelector('[data-prev]');
  const nextBtn = quizRoot.querySelector('[data-next]');
  const questionView = quizRoot.querySelector('[data-question-view]');
  const resultView = quizRoot.querySelector('[data-result-view]');

  function render() {
    const item = questions[index];
    questionEl.textContent = item.q;
    optionsEl.innerHTML = item.a.map((text, i) => `
      <label class="answer-option">
        <input type="radio" name="answer" value="${i}" ${answers[index] === i ? 'checked' : ''}>
        <span>${text}</span>
      </label>`).join('');
    optionsEl.querySelectorAll('input').forEach(input => input.addEventListener('change', () => {
      answers[index] = Number(input.value);
    }));
    counterEl.textContent = `Pregunta ${index + 1} de ${questions.length}`;
    progressEl.style.width = `${((index + 1) / questions.length) * 100}%`;
    prevBtn.disabled = index === 0;
    nextBtn.textContent = index === questions.length - 1 ? 'Ver resultado' : 'Siguiente';
  }

  prevBtn.addEventListener('click', () => { if (index > 0) { index--; render(); }});
  nextBtn.addEventListener('click', () => {
    if (answers[index] === null) { showToast('Selecciona una respuesta antes de continuar.'); return; }
    if (index < questions.length - 1) { index++; render(); return; }
    const score = answers.reduce((total, answer, i) => total + (answer === questions[i].c ? 1 : 0), 0);
    const pct = Math.round(score / questions.length * 100);
    questionView.style.display = 'none';
    resultView.style.display = 'block';
    resultView.querySelector('[data-score]').textContent = `${score}/${questions.length}`;
    let message = 'Necesitas reforzar la base antes de hacer simulacros completos.';
    if (pct >= 80) message = 'Muy buen nivel inicial. Estás preparado para trabajar con simulacros completos y carta náutica.';
    else if (pct >= 60) message = 'Tienes una buena base, pero conviene reforzar algunos bloques antes del examen.';
    else if (pct >= 40) message = 'Con un plan de estudio estructurado puedes progresar rápidamente.';
    resultView.querySelector('[data-result-message]').textContent = message;
  });
  render();
}
