(function () {
  const modules = [
    {title:'Nomenclatura náutica',description:'Conoce la estructura, las partes y los elementos fundamentales de una embarcación.',lessons:['Dimensiones principales','Partes del casco','Estructura de la embarcación','Equipo y terminología']},
    {title:'Amarre y fondeo',description:'Aprende a utilizar cabos, nudos, amarras y equipos de fondeo con seguridad.',lessons:['Cabos y operaciones','Nudos fundamentales','Elementos de amarre','Equipo y maniobra de fondeo']},
    {title:'Seguridad en la mar',description:'Estudia estabilidad, prevención, material de seguridad y actuación ante riesgos.',lessons:['Estabilidad básica','Prevención de accidentes','Material de seguridad','Abandono y supervivencia']},
    {title:'Legislación',description:'Revisa las normas esenciales, la documentación y la protección del medio marino.',lessons:['Documentación del barco','Responsabilidad del patrón','Limitaciones de navegación','Protección del medio marino']},
    {title:'Balizamiento IALA',description:'Interpreta marcas laterales, cardinales, de peligro aislado y especiales.',lessons:['Sistema lateral','Marcas cardinales','Peligro aislado y aguas navegables','Marcas especiales y peligros nuevos']},
    {title:'Reglamento RIPA',description:'Aplica las reglas de rumbo y gobierno, luces, marcas y señales.',lessons:['Riesgo de abordaje','Reglas de maniobra','Luces y marcas','Señales acústicas y visibilidad reducida']},
    {title:'Maniobra y emergencias',description:'Comprende los efectos del timón y la hélice y practica actuaciones de emergencia.',lessons:['Efectos del timón y la hélice','Atraque y desatraque','Hombre al agua','Incendio, varada y remolque']},
    {title:'Meteorología',description:'Interpreta presión, viento, frentes, estado de la mar y previsiones.',lessons:['Presión e isobaras','Viento y brisas costeras','Frentes y borrascas','Oleaje y previsiones']},
    {title:'Teoría de navegación',description:'Trabaja coordenadas, rumbos, demoras, marcaciones y correcciones.',lessons:['Coordenadas y cartas','Rumbos y corrección total','Demoras y marcaciones','Distancia, velocidad y tiempo']},
    {title:'Carta náutica',description:'Resuelve ejercicios de situación, rumbo, distancia, mareas y navegación en el Estrecho.',lessons:['Situación por demoras','Rumbos y distancias','Corrientes y tiempos','Mareas y ejercicios completos'],action:'curso-per.html#carta-ejercicios'}
  ];
  const params = new URLSearchParams(location.search);
  const number = Math.min(10, Math.max(1, Number(params.get('modulo')) || 1));
  const item = modules[number - 1];
  document.title = `${item.title} | Aula PER`;
  document.querySelector('[data-module-number]').textContent = `Módulo ${String(number).padStart(2,'0')}`;
  document.querySelector('[data-module-title]').textContent = item.title;
  document.querySelector('[data-module-description]').textContent = item.description;
  document.querySelector('[data-module-breadcrumb]').textContent = item.title;
  document.querySelector('[data-module-lessons]').innerHTML = item.lessons.map((lesson,index)=>`<a class="module" href="leccion-per.html?modulo=${number}&leccion=${index+1}"><span class="module-num">${String(index+1).padStart(2,'0')}</span><div><strong>${lesson}</strong><small>Entrar en la lección, materiales y actividades.</small></div><span class="module-time">Abrir →</span></a>`).join('');
  const previous = document.querySelector('[data-module-prev]');
  const next = document.querySelector('[data-module-next]');
  previous.href = number > 1 ? `modulo-per.html?modulo=${number-1}` : 'aula-per.html';
  next.href = number < 10 ? `modulo-per.html?modulo=${number+1}` : 'aula-per.html';
  document.querySelector('[data-module-action]').href = item.action || 'baterias-test.html';
})();
