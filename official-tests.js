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
  buttonsBox.innerHTML = exams.map((exam,i)=>`<button class="bank-button ${i===0?'active':''}" data-official-exam="${i}"><strong>${exam.name}</strong><small>${exam.date} · ${exam.code}</small></button>`).join('');
  function start(index=examIndex){examIndex=index;questionIndex=0;answers=new Array(exams[index].questions.length).fill(null);buttonsBox.querySelectorAll('button').forEach((b,i)=>b.classList.toggle('active',i===index));questionView.style.display='block';resultView.style.display='none';render();}
  function render(){const exam=exams[examIndex],item=exam.questions[questionIndex];title.textContent=item.q;meta.textContent=`${exam.name} · ${exam.date} · Clave ${exam.code}`;options.innerHTML=item.a.map((a,i)=>`<label class="answer-option"><input type="radio" name="official-answer" value="${i}" ${answers[questionIndex]===i?'checked':''}><span><strong>${'abcd'[i]})</strong> ${a}</span></label>`).join('');options.querySelectorAll('input').forEach(input=>input.addEventListener('change',()=>answers[questionIndex]=Number(input.value)));counter.textContent=`Pregunta ${questionIndex+1} de ${exam.questions.length}`;progress.style.width=`${(questionIndex+1)/exam.questions.length*100}%`;prev.disabled=questionIndex===0;next.textContent=questionIndex===exam.questions.length-1?'Corregir examen':'Siguiente';}
  function finish(){const exam=exams[examIndex],score=answers.reduce((s,a,i)=>s+(a===exam.questions[i].c?1:0),0);questionView.style.display='none';resultView.style.display='block';officialRoot.querySelector('[data-official-score]').textContent=`${score}/${exam.questions.length}`;officialRoot.querySelector('[data-official-message]').textContent=score>=32?'Resultado sólido. Revisa aun así las respuestas falladas.':score>=25?'Buena base, pero conviene repasar los bloques con errores.':'Necesitas reforzar el temario antes de repetir el examen.';officialRoot.querySelector('[data-official-review]').innerHTML=exam.questions.map((q,i)=>{const ok=answers[i]===q.c;return `<article class="review-item ${ok?'correct':'incorrect'}"><strong>${i+1}. ${ok?'Correcta':'Incorrecta'}</strong><p>Respuesta correcta: ${'abcd'[q.c]}) ${q.a[q.c]}</p></article>`}).join('');resultView.scrollIntoView({behavior:'smooth',block:'start'});}
  buttonsBox.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>start(Number(button.dataset.officialExam))));
  prev.addEventListener('click',()=>{if(questionIndex>0){questionIndex--;render();}});
  next.addEventListener('click',()=>{if(answers[questionIndex]===null){showToast('Selecciona una respuesta antes de continuar.');return;}if(questionIndex<exams[examIndex].questions.length-1){questionIndex++;render();}else finish();});
  officialRoot.querySelector('[data-official-retry]').addEventListener('click',()=>start());start(0);
}
