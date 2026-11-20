// Web para teléfono de las tarjetas QR (tools/tarjeta_qr/generar.py, 20 nov 2026).
// Lee window.SITIO (datos.js) y dibuja: portada, secciones (como el panel de la tablet) y ventanas para ver
// documentos, videos y hologramas. Rutas con # para que el botón Atrás del teléfono funcione:
//   #/            portada            #/n/<id>   sección (división, marca, producto)
//   #/d/<id>      documento          #/v/<id>   video          #/h/<id>   holograma
(function () {
  const S = window.SITIO, $ = (q) => document.querySelector(q);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const mb = (n) => (n / 1048576).toFixed(1).replace(".", ",") + " MB";
  const ICO = {
    flecha: '<svg class="flecha" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    bajar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0l-5-5m5 5l5-5M4 20h16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    atras: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="rgba(6,17,43,.55)"/><path d="M10 8l6 4-6 4z" fill="currentColor"/></svg>',
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

  // ------------------------------------------------------------------ páginas
  function portada() {
    let h = `<header class="hero"><div class="logo"><img src="img/logo-agarcorp.png" alt="Agarcorp de Venezuela"></div>
      <h1>Agarcorp de Venezuela C.A.</h1><h2>Fabricantes Especialistas en Medición y Control de Procesos</h2>
      <div class="chip">EXPO VENEZUELA ORIENTE 2026 <b>STAND 65</b></div></header><main>${bajarPrincipal()}
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

  // ------------------------------------------------------------------ rutas
  let pagina = null;   // ruta de la página de abajo (sin ventana)
  function ruta() {
    const h = location.hash || "#/", m = /^#\/(n|d|v|h)\/(.+)$/.exec(h), tipo = m && m[1], id = m && decodeURIComponent(m[2]);
    if (tipo === "d" || tipo === "v" || tipo === "h") {
      const directo = pagina === null;
      if (directo) { pagina = S.volverDe(tipo, id); dibujar(pagina); }   // entró directo a una ventana (enlace compartido)
      quitarVentana(); ven.dataset.vuelta = pagina; ven.dataset.directo = directo ? "1" : "";
      const ok = tipo === "d" ? verDoc(id) : tipo === "v" ? verVideo(id) : verHolo(id);
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
