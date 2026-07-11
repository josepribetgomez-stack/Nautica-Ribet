(function () {
  const modules = [
    {title:'Nomenclatura náutica',lessons:['Dimensiones principales','Partes del casco','Estructura de la embarcación','Equipo y terminología']},
    {title:'Amarre y fondeo',lessons:['Cabos y operaciones','Nudos fundamentales','Elementos de amarre','Equipo y maniobra de fondeo']},
    {title:'Seguridad en la mar',lessons:['Estabilidad básica','Prevención de accidentes','Material de seguridad','Abandono y supervivencia']},
    {title:'Legislación',lessons:['Documentación del barco','Responsabilidad del patrón','Limitaciones de navegación','Protección del medio marino']},
    {title:'Balizamiento IALA',lessons:['Sistema lateral','Marcas cardinales','Peligro aislado y aguas navegables','Marcas especiales y peligros nuevos']},
    {title:'Reglamento RIPA',lessons:['Riesgo de abordaje','Reglas de maniobra','Luces y marcas','Señales acústicas y visibilidad reducida']},
    {title:'Maniobra y emergencias',lessons:['Efectos del timón y la hélice','Atraque y desatraque','Hombre al agua','Incendio, varada y remolque']},
    {title:'Meteorología',lessons:['Presión e isobaras','Viento y brisas costeras','Frentes y borrascas','Oleaje y previsiones']},
    {title:'Teoría de navegación',lessons:['Coordenadas y cartas','Rumbos y corrección total','Demoras y marcaciones','Distancia, velocidad y tiempo']},
    {title:'Carta náutica',lessons:['Situación por demoras','Rumbos y distancias','Corrientes y tiempos','Mareas y ejercicios completos']}
  ];
  const params = new URLSearchParams(location.search);
  const moduleNumber = Math.min(10, Math.max(1, Number(params.get('modulo')) || 1));
  const lessonNumber = Math.min(4, Math.max(1, Number(params.get('leccion')) || 1));
  const module = modules[moduleNumber - 1];
  const lesson = module.lessons[lessonNumber - 1];
  const moduleUrl = `modulo-per.html?modulo=${moduleNumber}`;
  document.title = `${lesson} | ${module.title}`;
  document.querySelector('[data-lesson-number]').textContent = `Módulo ${String(moduleNumber).padStart(2,'0')} · Lección ${lessonNumber}`;
  document.querySelector('[data-lesson-title]').textContent = lesson;
  document.querySelector('[data-lesson-intro]').textContent = `Lección del módulo ${module.title}. Área preparada para organizar la explicación, los materiales y la práctica.`;
  document.querySelector('[data-lesson-breadcrumb]').textContent = lesson;
  const moduleLink = document.querySelector('[data-lesson-module-link]');
  moduleLink.textContent = module.title;
  moduleLink.href = moduleUrl;
  document.querySelector('[data-return-module]').href = moduleUrl;
  const previous = document.querySelector('[data-lesson-prev]');
  const next = document.querySelector('[data-lesson-next]');
  previous.href = lessonNumber > 1 ? `leccion-per.html?modulo=${moduleNumber}&leccion=${lessonNumber-1}` : moduleUrl;
  next.href = lessonNumber < 4 ? `leccion-per.html?modulo=${moduleNumber}&leccion=${lessonNumber+1}` : (moduleNumber < 10 ? `modulo-per.html?modulo=${moduleNumber+1}` : 'aula-per.html');
})();
