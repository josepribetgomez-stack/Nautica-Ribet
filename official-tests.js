const officialRoot = document.querySelector('[data-official-exams]');
if (officialRoot && Array.isArray(window.OFFICIAL_EXAMS)) {
  const exams = window.OFFICIAL_EXAMS;
  let examIndex = 0, questionIndex = 0, answers = [];
  const buttonsBox = officialRoot.querySelector('[data-official-buttons]');
  const questionView = officialRoot.querySelector('[data-official-question-view]');
  const resultView = officialRoot.querySelector('[data-official-result]');
  const title = officialRoot.querySelector('[data-official-title]');
  const options = officialRoot.querySelector('[data-official-options]');
  const counter = officialRoot.querySelector('[data-official-counter]');
  const progress = officialRoot.querySelector('[data-official-progress]');
  const meta = officialRoot.querySelector('[data-official-meta]');
  const prev = officialRoot.querySelector('[data-official-prev]');
  const next = officialRoot.querySelector('[data-official-next]');
  const cleanText = value => String(value ?? '')
    .replace(/Escola\s+de\s+Capacitaci[oó]\s+N[aà]utico[\s-]*Pesquera/gi, '')
    .replace(/Escola\s+de\s+Capacitaci[oó][^·|\n]*/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  const topicFor = index => {
    if (index < 4) return 'Nomenclatura náutica';
    if (index < 6) return 'Amarre y fondeo';
    if (index < 10) return 'Seguridad';
    if (index < 12) return 'Legislación';
    if (index < 17) return 'Balizamiento';
    if (index < 27) return 'Reglamento RIPA';
    if (index < 29) return 'Maniobra';
    if (index < 32) return 'Emergencias';
    if (index < 36) return 'Meteorología';
    if (index < 41) return 'Teoría de navegación';
    return 'Carta náutica';
  };
  const explanationFor = (question,index) => {
    if (question.explanation) return cleanText(question.explanation);
    const correct = cleanText(question.a[question.c]);
    const topic = topicFor(index);
    const guides = {
      'Nomenclatura náutica':'La denominación correcta se determina por la función y la posición del elemento en la embarcación.',
      'Amarre y fondeo':'En amarre y fondeo debe elegirse el elemento o la maniobra apropiados para la función descrita.',
      'Seguridad':'La respuesta correcta es la que reduce el riesgo y sigue el procedimiento de seguridad indicado para esa situación.',
      'Legislación':'La opción correcta coincide con la limitación o distancia de seguridad establecida para el supuesto planteado.',
      'Balizamiento':'La forma, los colores, la marca de tope y el ritmo de luz identifican la marca y señalan por dónde se encuentran las aguas navegables.',
      'Reglamento RIPA':'El RIPA determina la obligación de maniobrar mediante el tipo de buque, su situación relativa, las luces, las marcas y el riesgo de abordaje.',
      'Maniobra':'El efecto correcto depende del timón, la hélice, la arrancada y las fuerzas que actúan sobre la embarcación.',
      'Emergencias':'Debe seguirse la actuación que controla primero el peligro y protege a las personas y a la embarcación.',
      'Meteorología':'La respuesta se obtiene aplicando la definición meteorológica y el comportamiento de presión, viento o mar descrito.',
      'Teoría de navegación':'Hay que aplicar la definición o relación náutica correspondiente entre rumbo, demora, posición, distancia, velocidad o marea.',
      'Carta náutica':'La solución requiere situar los datos en la carta y aplicar ordenadamente rumbos, demoras, distancias, tiempos o mareas.'
    };
    return `${guides[topic]} Por eso, en esta pregunta la opción válida es: ${correct}`;
  };
  buttonsBox.innerHTML = exams.map((exam,i)=>`<button class="bank-button ${i===0?'active':''}" data-official-exam="${i}"><strong>${cleanText(exam.name)}</strong><small>${cleanText(exam.date)} · ${cleanText(exam.code)}</small></button>`).join('');
  function start(index=examIndex){examIndex=index;questionIndex=0;answers=new Array(exams[index].questions.length).fill(null);buttonsBox.querySelectorAll('button').forEach((b,i)=>b.classList.toggle('active',i===index));questionView.style.display='block';resultView.style.display='none';render();}
  function render(){const exam=exams[examIndex],item=exam.questions[questionIndex];title.textContent=cleanText(item.q);meta.textContent=`${cleanText(exam.name)} · ${cleanText(exam.date)} · Clave ${cleanText(exam.code)}`;options.innerHTML=item.a.map((a,i)=>`<label class="answer-option"><input type="radio" name="official-answer" value="${i}" ${answers[questionIndex]===i?'checked':''}><span><strong>${'abcd'[i]})</strong> ${cleanText(a)}</span></label>`).join('');options.querySelectorAll('input').forEach(input=>input.addEventListener('change',()=>answers[questionIndex]=Number(input.value)));counter.textContent=`Pregunta ${questionIndex+1} de ${exam.questions.length}`;progress.style.width=`${(questionIndex+1)/exam.questions.length*100}%`;prev.disabled=questionIndex===0;next.textContent=questionIndex===exam.questions.length-1?'Corregir examen':'Siguiente';}
  function finish(){const exam=exams[examIndex],score=answers.reduce((s,a,i)=>s+(a===exam.questions[i].c?1:0),0);questionView.style.display='none';resultView.style.display='block';officialRoot.querySelector('[data-official-score]').textContent=`${score}/${exam.questions.length}`;officialRoot.querySelector('[data-official-message]').textContent=score>=32?'Resultado sólido. Revisa aun así las respuestas falladas.':score>=25?'Buena base, pero conviene repasar los bloques con errores.':'Necesitas reforzar el temario antes de repetir el examen.';officialRoot.querySelector('[data-official-review]').innerHTML=exam.questions.map((q,i)=>{const ok=answers[i]===q.c;const selected=answers[i]===null?'Sin responder':`${'abcd'[answers[i]]}) ${cleanText(q.a[answers[i]])}`;return `<article class="review-item ${ok?'correct':'incorrect'}"><strong>${i+1}. ${ok?'Correcta':'Incorrecta'}</strong>${ok?'':`<p><b>Tu respuesta:</b> ${selected}</p>`}<p><b>Respuesta correcta:</b> ${'abcd'[q.c]}) ${cleanText(q.a[q.c])}</p>${ok?'':`<p><b>Explicación:</b> ${explanationFor(q,i)}</p>`}</article>`}).join('');resultView.scrollIntoView({behavior:'smooth',block:'start'});}
  buttonsBox.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>start(Number(button.dataset.officialExam))));
  prev.addEventListener('click',()=>{if(questionIndex>0){questionIndex--;render();}});
  next.addEventListener('click',()=>{if(answers[questionIndex]===null){showToast('Selecciona una respuesta antes de continuar.');return;}if(questionIndex<exams[examIndex].questions.length-1){questionIndex++;render();}else finish();});
  officialRoot.querySelector('[data-official-retry]').addEventListener('click',()=>start());start(0);
}
