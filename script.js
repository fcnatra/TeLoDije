function codificarGrupo(grupo) {
  // Codifica el grupo como base64 URL-safe
  const datos = JSON.stringify(grupo);
  return btoa(unescape(encodeURIComponent(datos)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function decodificarGrupo(str) {
  try {
    const datos = decodeURIComponent(escape(atob(str.replace(/-/g, '+').replace(/_/g, '/'))));
    return JSON.parse(datos);
  } catch (e) {
    return null;
  }
}

function obtenerGrupos() {
  const data = localStorage.getItem('grupos');
  return data ? JSON.parse(data) : [];
}

function guardarGrupos(grupos) {
  localStorage.setItem('grupos', JSON.stringify(grupos));
}

let grupoActualIdx = null;
function renderizarGrupos() {
  const lista = $('#grupos-lista');
  lista.empty();
  const grupos = obtenerGrupos();
  if (grupos.length === 0) {
    lista.append('<p style="text-align:center;color:#888;">Aún no hay grupos registrados.</p>');
    return;
  }
  grupos.forEach((grupo, idx) => {
    const selected = idx === grupoActualIdx ? 'selected' : '';
    const html = `<div class="grupo-item ${selected}" data-idx="${idx}">
      <span class="grupo-link-icon" data-link="${grupo.link}" title="Copiar enlace del grupo">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;cursor:pointer;"><path d="M7.5 12.5L12.5 7.5M8.75 6.25L6.25 8.75C4.75 10.25 4.75 12.75 6.25 14.25C7.75 15.75 10.25 15.75 11.75 14.25L14.25 11.75C15.75 10.25 15.75 7.75 14.25 6.25C12.75 4.75 10.25 4.75 8.75 6.25Z" stroke="#128c7e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </span>
      <span class="grupo-nombre">${grupo.nombre}</span>
      <span class="grupo-fecha">${grupo.fecha}</span>
    </div>`;
    lista.append(html);
  });
}

function renderizarGrupoSeleccionado() {
  const cont = $('#grupo-seleccionado');
  cont.empty();
  if (grupoActualIdx === null) {
    cont.append('<p style="text-align:center;color:#888;margin-top:60px;">Selecciona un grupo para ver y agregar predicciones.</p>');
    return;
  }
  const grupos = obtenerGrupos();
  const grupo = grupos[grupoActualIdx];
  // Formulario para nueva predicción
  const form = `<form id="nueva-prediccion-form">
    <div style="font-weight:bold;font-size:1.1em;color:#075e54;text-align:center;margin-bottom:8px;">${grupo.nombre} (${grupo.fecha})</div>
    <label for="nombre-persona">Tu nombre:</label>
    <input type="text" id="nombre-persona" name="nombre-persona" maxlength="30" required>
    <label for="texto-prediccion">Predicción (máx 100 caracteres):</label>
    <input type="text" id="texto-prediccion" name="texto-prediccion" maxlength="100" required>
    <button type="submit">Agregar predicción</button>
  </form>`;
  cont.append(form);
  // Lista de predicciones
  const lista = $('<div id="lista-predicciones-main"></div>');
  if (!grupo.predicciones || grupo.predicciones.length === 0) {
    lista.append('<p style="text-align:center;color:#888;">Aún no hay predicciones en este grupo.</p>');
  } else {
    grupo.predicciones.forEach(pred => {
      const html = `<div class="prediccion-modal-item">
        <div class="prediccion-modal-header">
          <span class="prediccion-modal-nombre">${pred.nombre}</span>
        </div>
        <div class="prediccion-modal-texto">${pred.prediccion}</div>
      </div>`;
      lista.append(html);
    });
  }
  cont.append(lista);
}

$(document).ready(function() {
  renderizarGrupos();
  renderizarGrupoSeleccionado();

  // Crear grupo
  $('#grupo-form').on('submit', function(e) {
    e.preventDefault();
    const fecha = $('#fecha').val();
    const nombre = $('#nombre-grupo').val().trim();
    if (!fecha || !nombre) return;
    if (nombre.length > 100) return;
    const grupoObj = { fecha, nombre, predicciones: [] };
    const hash = codificarGrupo(grupoObj);
    const link = `${window.location.origin}${window.location.pathname}#grupo=${hash}`;
    grupoObj.link = link;
    grupoObj.hash = hash;
    let grupos = obtenerGrupos();
    if (!grupos.some(g => g.hash === hash)) {
      grupos.push(grupoObj);
      guardarGrupos(grupos);
      grupoActualIdx = grupos.length - 1;
      renderizarGrupos();
      renderizarGrupoSeleccionado();
    }
    this.reset();
  });

  // Seleccionar grupo
  $('#grupos-lista').on('click', '.grupo-item', function(e) {
    if ($(e.target).closest('.grupo-link-icon').length > 0) return;
    grupoActualIdx = $(this).data('idx');
    renderizarGrupos();
    renderizarGrupoSeleccionado();
  });

  // Evento para copiar el link al portapapeles y feedback visual
  $(document).on('click', '.grupo-link-icon, .grupo-link-icon *', function(e) {
    e.stopPropagation();
    const link = $(this).closest('.grupo-link-icon').data('link');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
      const icon = $(this).closest('.grupo-link-icon');
      const original = icon.html();
      icon.html('<span style="color:#128c7e;font-size:1.1em;">¡Copiado!</span>');
      setTimeout(() => { icon.html(original); }, 1200);
    }
    return false;
  });

  // Agregar predicción individual
  $(document).on('submit', '#nueva-prediccion-form', function(e) {
    e.preventDefault();
    if (grupoActualIdx === null) return;
    const nombre = $('#nombre-persona').val().trim();
    const prediccion = $('#texto-prediccion').val().trim();
    if (!nombre || !prediccion) return;
    if (prediccion.length > 100) return;
    let grupos = obtenerGrupos();
    let grupo = grupos[grupoActualIdx];
    if (!grupo.predicciones) grupo.predicciones = [];
    grupo.predicciones.push({ nombre, prediccion });
    // Actualizar link y hash del grupo
    const nuevoHash = codificarGrupo({ fecha: grupo.fecha, nombre: grupo.nombre, predicciones: grupo.predicciones });
    const nuevoLink = `${window.location.origin}${window.location.pathname}#grupo=${nuevoHash}`;
    grupo.hash = nuevoHash;
    grupo.link = nuevoLink;
    guardarGrupos(grupos);
    renderizarGrupoSeleccionado();
    renderizarGrupos();
    this.reset();
  });
});

// Estilos para los items (puedes mover esto a style.css si prefieres)
$(function() {
  const style = `<style>
  .prediccion-item {
    background: #dcf8c6;
    border-radius: 7px;
    margin-bottom: 16px;
    padding: 10px 14px 8px 14px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    position: relative;
  }
  .prediccion-header {
    display: flex;
    justify-content: space-between;
    font-size: 0.93em;
    color: #555;
    margin-bottom: 3px;
  }
  .prediccion-nombre {
    font-weight: bold;
    color: #075e54;
  }
  .prediccion-fecha {
    font-size: 0.92em;
    color: #888;
  }
  .prediccion-texto {
    font-size: 1.08em;
    margin-bottom: 6px;
    color: #222;
  }
  .prediccion-link a {
    font-size: 0.92em;
    color: #128c7e;
    text-decoration: underline;
  }
  </style>`;
  $('head').append(style);
}); 