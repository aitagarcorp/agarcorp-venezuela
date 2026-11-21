// Web para teléfono de las tarjetas QR (tools/tarjeta_qr/generar.py, 20 nov 2026).
// Lee window.SITIO (datos.js) y dibuja: portada, secciones (como el panel de la tablet) y ventanas para ver
// documentos, videos y hologramas. Rutas con # para que el botón Atrás del teléfono funcione:
//   #/            portada            #/n/<id>   sección (división, marca, producto)
//   #/d/<id>      documento          #/v/<id>   video          #/h/<id>   holograma          #/c/<id>   tarjeta de contacto
(function () {
  const S = window.SITIO, $ = (q) => document.querySelector(q);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const mb = (n) => (n / 1048576).toFixed(1).replace(".", ",") + " MB";
  const ICO = {
    flecha: '<svg class="flecha" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    bajar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0l-5-5m5 5l5-5M4 20h16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    atras: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="rgba(6,17,43,.55)"/><path d="M10 8l6 4-6 4z" fill="currentColor"/></svg>',
    girar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 0 1 13.7-5.6M20 12a8 8 0 0 1-13.7 5.6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M18.5 2.8v4.1h-4.1M5.5 21.2v-4.1h4.1" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    guardar: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5M19 8v6M16 11h6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    cv: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2.5h8.5L19 7v14.5H6z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M14 2.8V7.5h4.7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="10.5" cy="10.3" r="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M7.8 15.2c.5-1.4 1.5-2.1 2.7-2.1s2.2.7 2.7 2.1M9 18.5h7M15 11h1.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    enviar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5L21 3l-6.5 18-3-7.5z" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linejoin="round"/><path d="M11.5 13.5L21 3" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/></svg>',
    tarjeta: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8.5" cy="10.5" r="2.3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M5 16c.6-1.6 1.9-2.4 3.5-2.4s2.9.8 3.5 2.4M14.5 10h4M14.5 13.5h3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  };
  // íconos de los datos de la tarjeta de contacto (en círculos azules, como la impresa)
  const ICOC = {
    mail: '<svg viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="12" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M4.5 7l7.5 6 7.5-6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/></svg>',
    tel: '<svg viewBox="0 0 24 24"><path d="M6.6 3.5l2.9 3.4-1.8 2.3c1.1 2.4 3 4.3 5.3 5.4l2.3-1.8 3.4 2.9-1.3 3c-.3.6-1 1-1.7.9C9.4 18.9 5.1 14.6 4.4 8.3c-.1-.7.3-1.4.9-1.7z" fill="currentColor"/></svg>',
    web: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 12h17M12 3.5c2.6 2.6 3.6 5.4 3.6 8.5s-1 5.9-3.6 8.5c-2.6-2.6-3.6-5.4-3.6-8.5S9.4 6.1 12 3.5z" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
    pin: '<svg viewBox="0 0 24 24"><path d="M12 2.5a7 7 0 0 0-7 7c0 5 7 12 7 12s7-7 7-12a7 7 0 0 0-7-7z" fill="currentColor"/><circle cx="12" cy="9.5" r="2.6" fill="#141b33"/></svg>',
  };
  const app = $("#app"), ven = $("#ventana");

  // ------------------------------------------------------------------ piezas
  const pie = () => `<footer><div class="lbl">JUNTO A NUESTROS ALIADOS</div><div class="aliados">${S.aliados.map((a) => `<img src="${a.img}" alt="${esc(a.name)}">`).join("")}</div>
    <p>© Agarcorp de Venezuela C.A. · Expo Venezuela Oriente 2026 · Stand 65</p></footer>`;
  const bajarPrincipal = () => S.descarga ? `<a class="bajar" href="${S.descarga.href}" download="${esc(S.descarga.archivo)}">${ICO.bajar}
    <span><b>${esc(S.descarga.titulo)}</b><small>PDF · ${mb(S.descarga.bytes)}</small></span></a>` : "";
  function itemDoc(id, grande) {
    const d = S.docs[id];
    return `<a class="item${grande ? " grande" : ""}" href="#/d/${encodeURIComponent(id)}"><div class="mini"><img src="${grande ? d.portada : d.thumb}" alt="" loading="lazy"></div>
      <div class="tx"><b>${esc(d.name)}</b><small>${d.pages.length} ${d.pages.length === 1 ? "página" : "páginas"} · PDF ${mb(d.pdfBytes)}</small><span class="abrir">Ver ${grande ? "presentación" : "documento"} ›</span></div></a>`;
  }
  function itemVideo(id) {
    const v = S.videos[id], min = Math.floor(v.dur / 60), seg = String(Math.round(v.dur % 60)).padStart(2, "0");
    return `<a class="item" href="#/v/${encodeURIComponent(id)}"><div class="mini"><img src="${v.thumb}" alt="" loading="lazy"><div class="play">${ICO.play}</div></div>
      <div class="tx"><b>${esc(v.name)}</b><small>Video · ${min}:${seg} · ${mb(v.bytes)}</small><span class="abrir">Reproducir ›</span></div></a>`;
  }
  function cajaNodo(id) {
    const n = S.nodes[id];
    const im = n.logo ? `<div class="im"><img src="${n.logo}" alt="" loading="lazy"></div>` : n.hero ? `<div class="im oscuro"><img src="${n.hero}" alt="" loading="lazy"></div>`
      : n.thumb ? `<div class="im foto"><img src="${n.thumb}" alt="" loading="lazy"></div>`
      : `<div class="im"><span class="ini">${esc(n.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase())}</span></div>`;
    return `<a class="caja" href="#/n/${encodeURIComponent(id)}">${im}<b>${esc(n.name)}</b><small>${esc(n.subtitle || "")}${n.total ? `${n.subtitle ? " · " : ""}${n.total} ${n.total === 1 ? "documento" : "documentos"}` : ""}</small></a>`;
  }
  function divisiones() {
    return S.roots.map((id) => {
      const n = S.nodes[id], navega = S.modo === "catalogo";
      const tag = navega ? `a href="#/n/${encodeURIComponent(id)}"` : "div";
      return `<${tag} class="div"><div class="im"><img src="${n.hero}" alt=""></div><div class="tx"><h3>${esc(n.name)}</h3><p>${esc(n.subtitle || "")}</p>
        ${navega ? `<small>${n.total} documentos${n.videos.length ? ` · ${n.videos.length} videos` : ""}</small>` : ""}</div>${navega ? ICO.flecha : ""}</${navega ? "a" : "div"}>`;
    }).join("");
  }

  // ------------------------------------------------------------------ tarjeta de contacto (21 nov 2026)
  // Copia de la tarjeta impresa: frente con nombre y datos, reverso con el QR (vCard: escanearlo guarda el contacto).
  // Dibujo en un lienzo de 550 x 1000 (proporción de la tarjeta vertical); los textos se miden con --u (1 % del ancho).
  const MARINO = '<linearGradient id="marino" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e2752"/><stop offset="1" stop-color="#121833"/></linearGradient>'
    + '<radialGradient id="luz" cx=".5" cy=".3" r=".65"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e4e7ec"/></radialGradient>';
  // franjas de arriba medidas sobre la foto de la tarjeta impresa (21 nov 2026), de arriba abajo en cada lado:
  // barra celeste, bloque azul, bloque marino grande (borde inclinado) y barra celeste, separados por líneas blancas finas.
  // Izquierda: el azul es corto y el marino sobresale a la derecha. Derecha: la barra celeste de arriba es larga, el azul
  // corto pegado al borde, el marino sale más hacia el centro y la celeste de abajo es corta.
  const decoArriba = '<rect width="550" height="1000" fill="url(#luz)"/>'
    + '<polygon points="0,55 122,39 125,52 0,69" fill="#3ea2d6"/>'
    + '<polygon points="0,73 75,63 80,97 0,107" fill="#3557a8"/>'
    + '<polygon points="0,111 113,97 141,185 0,203" fill="#262c4c"/>'
    + '<polygon points="0,210 102,196 105,208 0,223" fill="#3ea2d6"/>'
    + '<polygon points="387,15 550,0 550,13 389,28" fill="#3ea2d6"/>'
    + '<polygon points="441,25 550,15 550,46 446,56" fill="#3557a8"/>'
    + '<polygon points="387,70 550,50 550,138 417,156" fill="#262c4c"/>'
    + '<polygon points="446,158 550,145 550,158 449,171" fill="#3ea2d6"/>';
  const lienzo = (abajo) => `<svg class="deco" viewBox="0 0 550 1000" preserveAspectRatio="none" aria-hidden="true"><defs>${MARINO}</defs>${decoArriba}${abajo}</svg>`;
  const marca = '<img class="av" src="img/av.png" alt="Agarcorp de Venezuela"><div class="marca"><b>AGARCORP</b><span>De Venezuela, C.A.</span></div>';
  function fichaContacto(c) {
    const frente = lienzo('<polygon points="0,452 550,372 550,386 0,466" fill="#49a6dd"/><polygon points="0,472 550,392 550,436 0,516" fill="#2c5ba6"/>'
      + '<polygon points="0,516 550,436 550,1000 0,1000" fill="url(#marino)"/>');
    const reverso = lienzo('<polygon points="0,846 550,770 550,782 0,858" fill="#49a6dd"/><polygon points="0,866 550,790 550,822 0,898" fill="#2c5ba6"/>'
      + '<polygon points="0,898 550,822 550,1000 0,1000" fill="url(#marino)"/>');
    const fila = (ico, txt, href) => `<li${ico === "pin" ? ' class="dir"' : ""}><span class="ic">${ICOC[ico]}</span>${href ? `<a href="${href}"${/^https?:/.test(href) ? ' target="_blank" rel="noopener"' : ""}>${esc(txt)}</a>` : `<span>${esc(txt)}</span>`}</li>`;
    const mapa = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(c.dir);
    const correo = "mailto:" + c.email + (c.asunto ? "?subject=" + encodeURIComponent(c.asunto) : "");
    return `<div class="ficha${c.tel ? "" : " sin-tel"}" tabindex="0" role="button" aria-label="Tarjeta de ${esc(c.nombreTc)}: toque para girarla"><div class="giro">
      <div class="cara frente">${frente}${marca}<div class="persona"><h3>${esc(c.nombre)}</h3><p>${esc(c.cargo)}</p></div>
        <ul class="datos">${fila("mail", c.email, correo)}${c.tel ? fila("tel", c.tel, c.telHref) : ""}${fila("web", c.web, c.url)}${fila("pin", c.dir, mapa)}</ul></div>
      <div class="cara reverso">${reverso}${marca}<div class="qrc"><img src="${c.qr}" alt="Código QR: guarda el contacto de ${esc(c.nombreTc)}"><i></i><i></i><i></i><i></i></div>
        <div class="web">${esc(c.web)}</div></div></div></div>`;
  }
  const botonesContacto = () => (S.contactos || []).map((c) => `<a class="contacto${c.icono === "cv" ? " recluta" : ""}" href="#/c/${encodeURIComponent(c.id)}"><span class="ic">${ICO[c.icono] || ICO.tarjeta}</span>
    <span class="tx"><b>${esc(c.etiqueta)}</b><small>${esc(c.sub)}</small></span>${ICO.flecha}</a>`).join("");

  // ------------------------------------------------------------------ páginas
  function portada() {
    let h = `<header class="hero"><div class="logo"><img src="img/logo-agarcorp.png" alt="Agarcorp de Venezuela"></div>
      <h1>Agarcorp de Venezuela C.A.</h1><h2>Fabricantes Especialistas en Medición y Control de Procesos</h2>
      <div class="chip">EXPO VENEZUELA ORIENTE 2026 <b>STAND 65</b></div></header><main>${bajarPrincipal()}${botonesContacto()}
      <h2 class="tit">Nuestras Divisiones</h2><section class="divs">${divisiones()}</section>`;
    if (S.inicioDocs.length) h += `<h2 class="tit">${S.inicioDocs.length === 1 ? "Presentación" : "Presentaciones"}</h2><section class="lista">${S.inicioDocs.map((id) => itemDoc(id, S.inicioDocs.length === 1)).join("")}</section>`;
    if (S.holos.length) h += `<h2 class="tit">Vistas Holográficas <span>3D interactivo</span></h2><section class="grilla">${S.holos.map((x) =>
      `<a class="caja" href="#/h/${x.id}"><div class="im oscuro"><img src="${x.thumb}" alt="" loading="lazy"></div><b>${esc(x.name)}</b><small>${esc(x.title)}</small></a>`).join("")}</section>`;
    app.innerHTML = h + `</main>` + pie();
    document.title = S.titulo;
  }
  function seccion(id) {
    const n = S.nodes[id]; if (!n) { location.hash = "#/"; return; }
    const migas = n.crumbs.slice(0, -1).join(" › ") || "Inicio";
    const im = n.logo ? `<div class="im"><img src="${n.logo}" alt=""></div>` : n.hero ? `<div class="im oscuro"><img src="${n.hero}" alt=""></div>` : "";
    let h = `<div class="barra"><button class="atras" type="button" aria-label="Atrás">${ICO.atras}</button><div class="migas">${esc(migas)}</div>
      <a class="casa" href="#/" aria-label="Inicio"><img src="img/logo-agarcorp.png" alt=""></a></div>
      <main><div class="cab">${im}<div><h1>${esc(n.name)}</h1>${n.subtitle ? `<div class="sub">${esc(n.subtitle)}</div>` : ""}</div></div>
      ${n.description ? `<p class="desc">${esc(n.description)}</p>` : ""}`;
    if (n.children.length) h += `<h2 class="tit">${n.level === 0 ? "Marcas y servicios" : "Productos"}</h2><section class="grilla">${n.children.map(cajaNodo).join("")}</section>`;
    if (n.videos.length) h += `<h2 class="tit">Videos</h2><section class="lista">${n.videos.map(itemVideo).join("")}</section>`;
    if (n.docs.length) h += `<h2 class="tit">Documentos <span>${n.docs.length}</span></h2><section class="lista">${n.docs.map((d) => itemDoc(d)).join("")}</section>`;
    if (!n.children.length && !n.docs.length && !n.videos.length) h += `<p class="vacio">Próximamente.</p>`;
    app.innerHTML = h + `</main>` + pie();
    app.querySelector(".atras").addEventListener("click", () => { location.hash = n.parent ? "#/n/" + encodeURIComponent(n.parent) : "#/"; });
    document.title = n.name + " · Agarcorp de Venezuela";
  }

  // ------------------------------------------------------------------ ventanas
  function barraVentana(titulo, sub, descarga) {
    return `<div class="vb"><button class="cerrar" type="button" aria-label="Cerrar">×</button><div class="vt"><b>${esc(titulo)}</b><small>${esc(sub)}</small></div>
      ${descarga ? `<a class="dl" href="${descarga.href}" download="${esc(descarga.archivo)}">${ICO.bajar}<span>DESCARGAR</span></a>` : ""}</div>`;
  }
  function abrirVentana(html) {
    ven.innerHTML = html; ven.hidden = false; document.body.classList.add("tapado");
    ven.querySelector(".cerrar").addEventListener("click", cerrarVentana);
  }
  function cerrarVentana() {   // vuelve a la página de abajo: Atrás del historial, o reemplazo si se entró directo a la ventana
    if (ven.dataset.directo === "1") location.replace(ven.dataset.vuelta || "#/"); else history.back();
  }
  function quitarVentana() {
    if (ven.hidden) return;
    const v = ven.querySelector("video"); if (v) v.pause();
    ven.hidden = true; ven.innerHTML = ""; document.body.classList.remove("tapado");
  }
  function verDoc(id) {
    const d = S.docs[id]; if (!d) return false;
    abrirVentana(barraVentana(d.name, `${d.pages.length} ${d.pages.length === 1 ? "página" : "páginas"} · PDF ${mb(d.pdfBytes)}`, { href: d.pdf, archivo: d.archivo })
      + `<div class="cuerpo"><p class="pista">Pellizque con dos dedos para acercar.</p><div class="paginas">${d.pages.map((p, i) =>
        `<figure><img src="${d.media}/${p.f}" width="${p.w}" height="${p.h}" alt="Página ${i + 1}" ${i > 1 ? 'loading="lazy"' : ""} decoding="async"><figcaption>${i + 1}</figcaption></figure>`).join("")}</div></div>`);
    return true;
  }
  function verVideo(id) {
    const v = S.videos[id]; if (!v) return false;
    abrirVentana(barraVentana(v.name, "Video · " + mb(v.bytes), { href: v.src, archivo: v.archivo })
      + `<div class="cuerpo centro"><video src="${v.src}" poster="${v.thumb}" controls playsinline preload="metadata"></video></div>`);
    return true;
  }
  function verHolo(id) {
    const x = S.holos.find((h) => h.id === id); if (!x) return false;
    abrirVentana(barraVentana(x.title, "Gire con un dedo · acerque con dos") + `<div class="cuerpo"><div class="cargando"><span></span>Cargando el modelo 3D…</div><iframe title="${esc(x.title)}"></iframe></div>`);
    const f = ven.querySelector("iframe");
    // el holograma (modo panel) empieza en pausa hasta que le dicen que se ve
    // y con el modo exposición se encuadra solo (grande y completo en la pantalla del teléfono) y gira; un toque lo detiene
    f.addEventListener("load", () => {
      const c = ven.querySelector(".cargando"); if (c) c.remove();
      f.contentWindow.postMessage({ type: "als:holo-visible", visible: true }, "*");
      f.contentWindow.postMessage({ type: "als:expo", on: true }, "*");
    });
    f.src = x.url;
    return true;
  }

  function verContacto(id) {
    const c = (S.contactos || []).find((x) => x.id === id); if (!c) return false;
    // Guardar contacto = el mismo .vcf que guarda el QR. En Android se descarga y se abre con Contactos; en iPhone, al abrirlo
    // (sin "download") Safari muestra la ficha con "Crear contacto nuevo".
    const android = /Android/i.test(navigator.userAgent);
    const correo = "mailto:" + c.email + (c.asunto ? "?subject=" + encodeURIComponent(c.asunto) : "");
    abrirVentana(barraVentana(c.etiqueta, c.sub) + `<div class="cuerpo ficha-cuerpo${c.asunto ? " con-envio" : ""}"><div class="escena">${fichaContacto(c)}</div>
      <p class="pista">Toque la tarjeta para girarla</p>
      <div class="acciones"><button class="girar" type="button">${ICO.girar}<span>Girar tarjeta</span></button>
        <a class="guardar" href="${c.vcf}"${android ? ` download="${esc(c.archivo)}"` : ""}>${ICO.guardar}<span>Guardar contacto</span></a>
        ${c.asunto ? `<a class="enviar" href="${correo}">${ICO.enviar}<span>Enviar currículum</span></a>` : ""}</div></div>`);
    const f = ven.querySelector(".ficha"), girar = () => f.classList.toggle("vuelta");
    f.addEventListener("click", (e) => { if (!e.target.closest("a")) girar(); });
    f.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); girar(); } });
    ven.querySelector(".girar").addEventListener("click", girar);
    return true;
  }

  // ------------------------------------------------------------------ rutas
  let pagina = null;   // ruta de la página de abajo (sin ventana)
  function ruta() {
    const h = location.hash || "#/", m = /^#\/(n|d|v|h|c)\/(.+)$/.exec(h), tipo = m && m[1], id = m && decodeURIComponent(m[2]);
    if (tipo === "d" || tipo === "v" || tipo === "h" || tipo === "c") {
      const directo = pagina === null;
      if (directo) { pagina = S.volverDe(tipo, id); dibujar(pagina); }   // entró directo a una ventana (enlace compartido)
      quitarVentana(); ven.dataset.vuelta = pagina; ven.dataset.directo = directo ? "1" : "";
      const ok = tipo === "d" ? verDoc(id) : tipo === "v" ? verVideo(id) : tipo === "c" ? verContacto(id) : verHolo(id);
      if (!ok) location.hash = pagina;
      return;
    }
    quitarVentana();
    const nueva = h === "#" ? "#/" : h;
    if (nueva !== pagina) { pagina = nueva; dibujar(nueva); window.scrollTo(0, 0); }
  }
  function dibujar(r) {
    const m = /^#\/n\/(.+)$/.exec(r);
    if (m && S.modo === "catalogo") seccion(decodeURIComponent(m[1])); else portada();
  }
  // a qué página volver si alguien abre directo el enlace de una ventana
  S.volverDe = (tipo, id) => {
    const o = tipo === "d" ? S.docs[id] : tipo === "v" ? S.videos[id] : null;
    return o && o.parent && S.modo === "catalogo" && !S.inicioDocs.includes(id) ? "#/n/" + encodeURIComponent(o.parent) : "#/";
  };
  addEventListener("hashchange", ruta);
  ruta();
})();
