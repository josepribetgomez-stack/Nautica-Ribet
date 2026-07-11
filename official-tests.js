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
  const spanishText = value => {
    const text = cleanText(value);
    const parts = text.split('/').map(part => part.trim()).filter(Boolean);
    return parts.length > 1 ? parts[parts.length - 1] : text;
  };
  const conceptReason = (question,index) => {
    const prompt = spanishText(question.q).toLowerCase();
    const correct = spanishText(question.a[question.c]);
    const topic = topicFor(index);
    const rules = [
      [/quilla.*proa|prolonga.*quilla/, 'la roda es la pieza estructural que continúa la quilla hacia la proa'],
      [/torno horizontal.*ancla|levar las anclas/, 'el molinete es el torno horizontal empleado para virar la cadena y levar el ancla'],
      [/derrames|líquidos.*interior/, 'la sentina es la zona baja donde se recogen los líquidos del interior'],
      [/dónde queda fondeada|donde queda fondeada/, 'orincar consiste en señalar la posición del ancla mediante un orinque y una boya'],
      [/persona.*agua.*no ver|no ver.*persona/, 'cuando no se mantiene contacto visual debe iniciarse un patrón de búsqueda, como la espiral cuadrada'],
      [/grifos de fondo.*mal tiempo/, 'se cierran los grifos innecesarios, pero se mantiene abierto el de refrigeración si el motor está funcionando'],
      [/aguas someras/, 'se consideran someras cuando la profundidad es menor que la mitad de la longitud de onda'],
      [/playas balizadas/, 'en la zona de baño balizada no se permite entrar ni fondear con embarcaciones o artefactos flotantes'],
      [/zona de buceo|bandera alfa|bandera bravo/, 'debe respetarse la distancia de seguridad señalada para no poner en peligro a los buceadores'],
      [/marca cardinal|marcas cardinales|cuadrante/, 'las marcas cardinales se interpretan por sus colores negro y amarillo, sus conos y el ritmo de luz blanca'],
      [/peligro aislado/, 'la marca de peligro aislado señala un obstáculo localizado con aguas navegables alrededor'],
      [/marca especial|vertedero|acuicultura/, 'una marca especial es amarilla y puede llevar una aspa amarilla como marca de tope'],
      [/canal principal/, 'una marca lateral modificada indica, por sus franjas y color central, el lado del canal principal'],
      [/luz de remolque/, 'la luz de remolque es amarilla y tiene las mismas características que una luz de alcance'],
      [/sin gobierno/, 'un buque sin gobierno muestra dos bolas negras en vertical de día y dos luces rojas todo horizonte de noche'],
      [/fondeado|fondejada/, 'la bola negra es la marca diurna de un buque fondeado; las luces dependen de su eslora'],
      [/pitada corta|silbada corta|xiulada curta/, 'el RIPA define la pitada corta como un sonido de aproximadamente un segundo'],
      [/vigilancia.*niebla/, 'incluso fondeado debe mantenerse una vigilancia eficaz tanto visual como auditiva'],
      [/velocidad de seguridad/, 'la velocidad de seguridad se fija valorando, entre otros factores, el calado respecto de la profundidad disponible'],
      [/vela.*motor|motor.*vela/, 'un velero que usa simultáneamente vela y motor se considera buque de propulsión mecánica'],
      [/vuelta encontrada|rumbos opuestos/, 'en una vuelta encontrada ambos buques de propulsión mecánica deben caer a estribor'],
      [/situación de cruce|situacion de cruce|encreuament/, 'en un cruce maniobra el buque que tiene al otro por su costado de estribor; el otro mantiene rumbo y velocidad inicialmente'],
      [/buque que alcanza|embarcación que alcanza|abasta/, 'el buque que alcanza debe mantenerse apartado hasta quedar definitivamente en franquía'],
      [/buques de vela|embarcaciones.*vela/, 'entre veleros se aplican la banda por la que reciben el viento y, cuando procede, la posición de barlovento o sotavento'],
      [/atracad|cabos.*reforzar|amarras/, 'se refuerzan los cabos que se oponen al desplazamiento que producirá el viento'],
      [/lascar/, 'lascar significa aflojar o dejar correr de forma controlada un cabo que está trabajando'],
      [/ciabogar|ciavogar/, 'ciabogar es hacer girar la embarcación en el menor espacio posible'],
      [/varada involuntaria|embarrancada involunt/, 'antes de intentar salir hay que evaluar daños, sondas, marea y naturaleza del fondo para no agravar la avería'],
      [/zafa hidrostática|liberación automática.*balsa/, 'la zafa hidrostática libera automáticamente la balsa cuando la embarcación se hunde'],
      [/hombre al agua|tripulante.*agua/, 'se mete el timón hacia la banda de caída para apartar la popa y la hélice de la persona'],
      [/incendio.*sofocación/, 'la sofocación extingue el fuego al privarlo de oxígeno'],
      [/bengalas/, 'las bengalas se utilizan por sotavento para evitar que residuos encendidos caigan sobre la embarcación'],
      [/escala.*estado de la mar|altura de las olas/, 'la escala Douglas clasifica el estado de la mar según la altura del oleaje'],
      [/altas presiones/, 'en el hemisferio norte el viento gira en sentido horario alrededor de un anticiclón'],
      [/brisas costeras/, 'las brisas costeras son la virazón o marinada durante el día y el terral durante la noche'],
      [/amplitud de la marea/, 'la amplitud es la diferencia de altura entre una pleamar y la bajamar consecutiva'],
      [/rumbo cuadrantal/, 'un rumbo S24W se cuenta desde el Sur 24 grados hacia el Oeste, equivalente a 204 grados circular'],
      [/paralelas al ecuador/, 'las circunferencias menores paralelas al Ecuador se llaman paralelos'],
      [/marcación.*faro|proa a un faro/, 'un objeto exactamente por la proa tiene marcación cero grados'],
      [/declinación magnética/, 'la declinación se actualiza multiplicando la variación anual por los años transcurridos y aplicando su signo'],
      [/corrección total|correccio total/, 'la corrección total se obtiene comparando la demora verdadera con la demora de aguja con sus signos'],
      [/hora.*llegar|hora.*arrib/, 'el tiempo de navegación se obtiene dividiendo la distancia por la velocidad y sumándolo a la hora de salida'],
      [/sonda momento/, 'la sonda del momento es la sonda de carta más la altura de marea, corregida cuando corresponda por la presión'],
      [/posición|situación/, 'la situación se obtiene por la intersección de las líneas de posición trazadas en la carta'],
      [/cetáceos/, 'en la zona de protección de cetáceos se reducen velocidad y ruido y se respeta la distancia mínima reglamentaria']
    ];
    const match = rules.find(([pattern]) => pattern.test(prompt));
    if (match) return `${match[1]}. Por ello, la respuesta aplicable es «${correct}».`;
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
    return `${guides[topic]} En el supuesto planteado, ese criterio conduce a «${correct}».`;
  };
  const explanationFor = (question,index,selectedIndex) => {
    if (question.explanation) return cleanText(question.explanation);
    const reason = conceptReason(question,index);
    if (selectedIndex === null) return `La pregunta quedó sin responder. ${reason}`;
    const selected = spanishText(question.a[selectedIndex]);
    return `«${selected}» no cumple el criterio que pide la pregunta. ${reason}`;
  };
  buttonsBox.innerHTML = exams.map((exam,i)=>`<button class="bank-button ${i===0?'active':''}" data-official-exam="${i}"><strong>${cleanText(exam.name)}</strong><small>${cleanText(exam.date)} · ${cleanText(exam.code)}</small></button>`).join('');
  function start(index=examIndex){examIndex=index;questionIndex=0;answers=new Array(exams[index].questions.length).fill(null);buttonsBox.querySelectorAll('button').forEach((b,i)=>b.classList.toggle('active',i===index));questionView.style.display='block';resultView.style.display='none';render();}
  function render(){const exam=exams[examIndex],item=exam.questions[questionIndex];title.textContent=cleanText(item.q);meta.textContent=`${cleanText(exam.name)} · ${cleanText(exam.date)} · Clave ${cleanText(exam.code)}`;options.innerHTML=item.a.map((a,i)=>`<label class="answer-option"><input type="radio" name="official-answer" value="${i}" ${answers[questionIndex]===i?'checked':''}><span><strong>${'abcd'[i]})</strong> ${cleanText(a)}</span></label>`).join('');options.querySelectorAll('input').forEach(input=>input.addEventListener('change',()=>answers[questionIndex]=Number(input.value)));counter.textContent=`Pregunta ${questionIndex+1} de ${exam.questions.length}`;progress.style.width=`${(questionIndex+1)/exam.questions.length*100}%`;prev.disabled=questionIndex===0;next.textContent=questionIndex===exam.questions.length-1?'Corregir examen':'Siguiente';}
  function finish(){const exam=exams[examIndex],score=answers.reduce((s,a,i)=>s+(a===exam.questions[i].c?1:0),0);questionView.style.display='none';resultView.style.display='block';officialRoot.querySelector('[data-official-score]').textContent=`${score}/${exam.questions.length}`;officialRoot.querySelector('[data-official-message]').textContent=score>=32?'Resultado sólido. Revisa aun así las respuestas falladas.':score>=25?'Buena base, pero conviene repasar los bloques con errores.':'Necesitas reforzar el temario antes de repetir el examen.';officialRoot.querySelector('[data-official-review]').innerHTML=exam.questions.map((q,i)=>{const ok=answers[i]===q.c;const selected=answers[i]===null?'Sin responder':`${'abcd'[answers[i]]}) ${cleanText(q.a[answers[i]])}`;return `<article class="review-item ${ok?'correct':'incorrect'}"><strong>${i+1}. ${ok?'Correcta':'Incorrecta'}</strong>${ok?'':`<p><b>Tu respuesta:</b> ${selected}</p>`}<p><b>Respuesta correcta:</b> ${'abcd'[q.c]}) ${cleanText(q.a[q.c])}</p>${ok?'':`<p><b>Por qué:</b> ${explanationFor(q,i,answers[i])}</p>`}</article>`}).join('');resultView.scrollIntoView({behavior:'smooth',block:'start'});}
  buttonsBox.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>start(Number(button.dataset.officialExam))));
  prev.addEventListener('click',()=>{if(questionIndex>0){questionIndex--;render();}});
  next.addEventListener('click',()=>{if(answers[questionIndex]===null){showToast('Selecciona una respuesta antes de continuar.');return;}if(questionIndex<exams[examIndex].questions.length-1){questionIndex++;render();}else finish();});
  officialRoot.querySelector('[data-official-retry]').addEventListener('click',()=>start());start(0);
}
