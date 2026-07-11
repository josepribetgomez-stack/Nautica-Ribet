(function () {
  const client = window.nauticaSupabase;
  const params = new URLSearchParams(location.search);
  const moduleNumber = Math.min(10, Math.max(1, Number(params.get('modulo')) || 1));
  const lessonNumber = Math.min(4, Math.max(1, Number(params.get('leccion')) || 1));
  const editor = document.querySelector('[data-lesson-editor]');
  const form = document.querySelector('[data-lesson-editor-form]');
  const status = document.querySelector('[data-lesson-editor-status]');

  function showContent(content) {
    if (!content) return;
    if (content.title) {
      document.querySelector('[data-lesson-title]').textContent = content.title;
      document.querySelector('[data-lesson-breadcrumb]').textContent = content.title;
      document.title = `${content.title} | Aula PER`;
    }
    if (content.intro) document.querySelector('[data-lesson-intro]').textContent = content.intro;
    document.querySelector('[data-content-notes]').textContent = content.notes || 'Apuntes pendientes de publicación.';
    document.querySelector('[data-content-exercise]').textContent = content.exercise || 'Ejercicio pendiente de publicación.';
    const videoLink = document.querySelector('[data-content-video-link]');
    const videoText = document.querySelector('[data-content-video-text]');
    if (content.video_url) {
      videoLink.href = content.video_url;
      videoLink.hidden = false;
      videoText.textContent = 'Vídeo disponible para esta lección.';
    } else {
      videoLink.hidden = true;
      videoText.textContent = 'Vídeo pendiente de publicación.';
    }
    document.querySelector('[data-content-status]').textContent = content.updated_at ? 'Contenido actualizado' : 'Lección preparada';
  }

  async function loadContent() {
    const { data, error } = await client.from('course_lessons').select('title,intro,video_url,notes,exercise,updated_at').eq('module_number', moduleNumber).eq('lesson_number', lessonNumber).maybeSingle();
    if (error) {
      console.error(error);
      if (status) status.textContent = 'No se pudo cargar el contenido editable.';
      return null;
    }
    showContent(data);
    return data;
  }

  document.addEventListener('nautica:authenticated', async event => {
    const data = await loadContent();
    if (event.detail.profile.role !== 'admin') return;
    editor.hidden = false;
    const defaults = {
      title: document.querySelector('[data-lesson-title]').textContent.trim(),
      intro: document.querySelector('[data-lesson-intro]').textContent.trim(),
      video_url: '', notes: '', exercise: ''
    };
    const values = Object.assign(defaults, data || {});
    Object.entries(values).forEach(([key,value]) => {
      const field = form.elements.namedItem(key);
      if (field) field.value = value || '';
    });
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const values = new FormData(form);
    const payload = {
      module_number: moduleNumber,
      lesson_number: lessonNumber,
      title: String(values.get('title') || '').trim(),
      intro: String(values.get('intro') || '').trim() || null,
      video_url: String(values.get('video_url') || '').trim() || null,
      notes: String(values.get('notes') || '').trim() || null,
      exercise: String(values.get('exercise') || '').trim() || null,
      updated_at: new Date().toISOString()
    };
    button.disabled = true;
    status.textContent = 'Guardando…';
    const { data, error } = await client.from('course_lessons').upsert(payload, { onConflict: 'module_number,lesson_number' }).select('title,intro,video_url,notes,exercise,updated_at').single();
    button.disabled = false;
    if (error) {
      console.error(error);
      status.textContent = 'No se pudieron guardar los cambios.';
      return;
    }
    showContent(data);
    status.textContent = 'Cambios guardados correctamente.';
  });
})();
