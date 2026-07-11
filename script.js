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

// PER exam-style practice batteries
const banksRoot = document.querySelector('[data-test-banks]');
if (banksRoot) {
  const banks = [
    [
      ['¿Qué costado corresponde a estribor mirando hacia proa?',['El izquierdo','El derecho','El de sotavento','Depende del rumbo'],1,'Estribor es el costado derecho mirando hacia proa.'],
      ['¿Cuál es la finalidad principal de un chaleco salvavidas?',['Evitar el mareo','Mantener a una persona a flote','Proteger del sol','Facilitar el remolque'],1,'Está diseñado para proporcionar flotabilidad y ayudar a mantener las vías respiratorias fuera del agua.'],
      ['Ante una caída de persona al agua, la primera actuación incluye:',['Dar la alarma y mantener contacto visual','Fondear','Apagar el motor siempre','Emitir PAN PAN'],0,'La alarma y el señalamiento continuo permiten iniciar la maniobra sin perder de vista a la persona.'],
      ['La señal MAYDAY indica:',['Aviso meteorológico','Urgencia','Peligro grave e inminente','Mensaje de seguridad'],2,'MAYDAY se reserva para situaciones de socorro con peligro grave e inminente.'],
      ['Un nudo equivale a:',['Una milla náutica por hora','Un kilómetro por hora','1.852 kilómetros','Una milla terrestre por hora'],0,'El nudo es una unidad de velocidad equivalente a una milla náutica por hora.'],
      ['Antes de zarpar debe comprobarse:',['Solo el combustible','Meteorología, equipo, documentación y planificación','Solo el teléfono','Únicamente la marea'],1,'La preparación debe abarcar condiciones, equipo, documentación, combustible y plan de navegación.'],
      ['El fondeo tiene como finalidad:',['Medir la sonda','Sujetar la embarcación al fondo','Aumentar la estabilidad en marcha','Corregir el rumbo'],1,'El ancla y la línea de fondeo mantienen la embarcación vinculada al fondo.'],
      ['El barómetro mide:',['La humedad','La velocidad del viento','La presión atmosférica','La temperatura del mar'],2,'La presión atmosférica se mide con un barómetro.'],
      ['Una milla náutica equivale a:',['1.609 m','1.852 m','2.000 m','1.500 m'],1,'La milla náutica internacional tiene 1.852 metros.'],
      ['¿Qué documento debe consultarse para conocer previsiones antes de navegar?',['Un parte meteorológico actualizado','Solo la carta náutica','La factura del combustible','El rol de despacho exclusivamente'],0,'La previsión actualizada es esencial para valorar la seguridad de la salida.']
    ],
    [
      ['En una vuelta encontrada entre buques de propulsión mecánica, ambos deben:',['Caer a babor','Caer a estribor','Mantener rumbo','Parar máquinas'],1,'Cada buque cae a estribor para pasar por la banda de babor del otro.'],
      ['Una luz roja de costado corresponde a:',['Estribor','Babor','Popa','Tope'],1,'La luz de babor es roja y la de estribor es verde.'],
      ['Una marca cardinal Norte señala aguas navegables:',['Al norte','Al sur','Al este','Al oeste'],0,'Se debe pasar al norte de una cardinal Norte.'],
      ['En IALA A, una marca lateral de estribor es:',['Roja y cilíndrica','Verde y cónica','Amarilla y esférica','Negra y roja'],1,'En la región A, estribor es verde y su forma característica es cónica.'],
      ['Un buque sin gobierno muestra dos luces:',['Verdes','Rojas todo horizonte en vertical','Blancas intermitentes','Amarillas'],1,'Dos luces rojas todo horizonte en vertical identifican a un buque sin gobierno.'],
      ['La velocidad de seguridad debe permitir:',['Mantener siempre el planeo','Actuar eficazmente y detenerse a distancia apropiada','Evitar usar radar','No alterar el rumbo'],1,'Debe permitir adoptar medidas eficaces para evitar el abordaje y parar adecuadamente.'],
      ['Una marca de peligro aislado presenta normalmente:',['Negro con una o más bandas rojas','Solo amarillo','Rojo y verde','Solo blanco'],0,'Su color característico es negro con una o más bandas horizontales rojas.'],
      ['Un buque que alcanza debe mantenerse apartado:',['Solo si es más pequeño','Hasta quedar pasado y en franquía','Solo de noche','Si navega por babor'],1,'La obligación continúa hasta quedar completamente pasado y en franquía.'],
      ['La señal acústica de una pitada corta significa:',['Caigo a estribor','Caigo a babor','Doy atrás','Estoy fondeado'],0,'Una pitada corta indica alteración del rumbo a estribor.'],
      ['Las marcas especiales son principalmente de color:',['Rojo','Verde','Amarillo','Negro'],2,'Las marcas especiales utilizan el amarillo como color distintivo.']
    ],
    [
      ['La latitud se mide desde:',['Greenwich','El ecuador','El polo norte','La línea de costa'],1,'La latitud se cuenta desde el ecuador hacia el norte o el sur.'],
      ['La longitud se mide desde:',['El ecuador','El meridiano de Greenwich','El polo sur','La declinación magnética'],1,'La longitud se cuenta al este u oeste desde Greenwich.'],
      ['La corrección total relaciona:',['Rumbo verdadero y rumbo de aguja','Velocidad y tiempo','Latitud y longitud','Sonda y marea'],0,'Permite pasar entre el rumbo verdadero y el rumbo de aguja.'],
      ['La declinación magnética es el ángulo entre:',['Norte verdadero y norte magnético','Norte magnético y norte de aguja','Rumbo y demora','Proa y popa'],0,'Es la diferencia angular entre el norte verdadero y el magnético.'],
      ['La demora es el ángulo entre:',['Una referencia y la visual a un objeto','La proa y la popa','La vertical y el horizonte','Dos sondas'],0,'La demora expresa la dirección de un objeto respecto a una referencia.'],
      ['Distancia recorrida se obtiene multiplicando:',['Velocidad por tiempo','Rumbo por velocidad','Presión por tiempo','Sonda por marea'],0,'Con unidades coherentes, distancia = velocidad × tiempo.'],
      ['Un frente frío puede producir:',['Chubascos y cambios de viento','Calma permanente','Mareas muertas','Ausencia de nubes'],0,'Su paso suele ir acompañado de cambios de viento, nubosidad y chubascos.'],
      ['Las isobaras unen puntos de igual:',['Temperatura','Presión atmosférica','Profundidad','Humedad'],1,'Una isobara conecta lugares con la misma presión atmosférica.'],
      ['La marcación se mide respecto a:',['La línea de crujía o proa','El norte verdadero siempre','Greenwich','El ecuador'],0,'La marcación es el ángulo entre la proa y la visual al objeto.'],
      ['Para medir distancias en una carta se utiliza la escala de:',['Longitudes','Latitudes','Colores','Rumbos'],1,'Las distancias se toman en la escala de latitudes, donde un minuto equivale a una milla náutica.']
    ]
  ];
  let activeBank = 0;
  let bankIndex = 0;
  let bankAnswers = [];
  const bankButtons = banksRoot.querySelectorAll('[data-bank]');
  const bankQuestionView = banksRoot.querySelector('[data-bank-question-view]');
  const bankResult = banksRoot.querySelector('[data-bank-result]');
  const bankTitle = banksRoot.querySelector('[data-bank-title]');
  const bankOptions = banksRoot.querySelector('[data-bank-options]');
  const bankCounter = banksRoot.querySelector('[data-bank-counter]');
  const bankProgress = banksRoot.querySelector('[data-bank-progress]');
  const bankPrev = banksRoot.querySelector('[data-bank-prev]');
  const bankNext = banksRoot.querySelector('[data-bank-next]');

  function resetBank(number = activeBank) {
    activeBank = number; bankIndex = 0; bankAnswers = new Array(banks[activeBank].length).fill(null);
    bankButtons.forEach(button => button.classList.toggle('active', Number(button.dataset.bank) === activeBank));
    bankQuestionView.style.display = 'block'; bankResult.style.display = 'none'; renderBank();
  }
  function renderBank() {
    const item = banks[activeBank][bankIndex];
    bankTitle.textContent = item[0];
    bankOptions.innerHTML = item[1].map((answer,i) => `<label class="answer-option"><input type="radio" name="bank-answer" value="${i}" ${bankAnswers[bankIndex]===i?'checked':''}><span>${answer}</span></label>`).join('');
    bankOptions.querySelectorAll('input').forEach(input => input.addEventListener('change',()=>{ bankAnswers[bankIndex]=Number(input.value); }));
    bankCounter.textContent = `Pregunta ${bankIndex+1} de ${banks[activeBank].length}`;
    bankProgress.style.width = `${(bankIndex+1)/banks[activeBank].length*100}%`;
    bankPrev.disabled = bankIndex === 0;
    bankNext.textContent = bankIndex === banks[activeBank].length-1 ? 'Corregir test' : 'Siguiente';
  }
  function finishBank() {
    const questions = banks[activeBank];
    const score = bankAnswers.reduce((sum,answer,i)=>sum+(answer===questions[i][2]?1:0),0);
    bankQuestionView.style.display='none'; bankResult.style.display='block';
    banksRoot.querySelector('[data-bank-score]').textContent=`${score}/${questions.length}`;
    banksRoot.querySelector('[data-bank-message]').textContent=score>=8?'Muy buen resultado. Revisa los detalles antes de pasar a la siguiente batería.':score>=6?'Buena base. Revisa los fallos y repite la batería.':'Conviene repasar estos bloques antes de continuar.';
    banksRoot.querySelector('[data-bank-review]').innerHTML=questions.map((q,i)=>{const ok=bankAnswers[i]===q[2];return `<article class="review-item ${ok?'correct':'incorrect'}"><strong>${i+1}. ${ok?'Correcta':'Incorrecta'}</strong><p>Respuesta correcta: ${q[1][q[2]]}. ${q[3]}</p></article>`;}).join('');
    bankResult.scrollIntoView({behavior:'smooth',block:'start'});
  }
  bankButtons.forEach(button=>button.addEventListener('click',()=>resetBank(Number(button.dataset.bank))));
  bankPrev.addEventListener('click',()=>{if(bankIndex>0){bankIndex--;renderBank();}});
  bankNext.addEventListener('click',()=>{if(bankAnswers[bankIndex]===null){showToast('Selecciona una respuesta antes de continuar.');return;}if(bankIndex<banks[activeBank].length-1){bankIndex++;renderBank();}else finishBank();});
  banksRoot.querySelector('[data-bank-retry]').addEventListener('click',()=>resetBank());
  resetBank(0);
}
