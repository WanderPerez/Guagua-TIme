// ==========================================
// 🎓 RUTAS RD - VERSIÓN COMPLETA
// ✅ PWA + Service Worker
// ✅ i18n (ES/EN)
// ✅ Modo Ahorro de Datos
// ✅ Mini-mapa SVG
// ==========================================

// LUGARES - Coordenadas organizadas
const lugares = [
    { id: "centro", name: "Zona Colonial", x: 50, y: 90, labelX: 50, labelY: 95 },
    { id: "malecon", name: "Malecón", x: 15, y: 70, labelX: 15, labelY: 75 },
    { id: "gazcue", name: "Gazcue", x: 30, y: 80, labelX: 30, labelY: 85 },
    { id: "bella", name: "Bella Vista", x: 25, y: 55, labelX: 25, labelY: 60 },
    { id: "naco", name: "Naco", x: 50, y: 50, labelX: 50, labelY: 55 },
    { id: "piantini", name: "Piantini", x: 70, y: 35, labelX: 70, labelY: 40 },
    { id: "popeye", name: "La Julia", x: 85, y: 55, labelX: 85, labelY: 60 },
    { id: "megacentro", name: "Megacentro", x: 75, y: 75, labelX: 75, labelY: 80 }
];

// COLORES DE TRANSPORTE
const COLORES_TRANSPORTE = {
    bus: '#16a34a',
    moto: '#dc2626',
    carro: '#f97316'
};

// NOMBRES DE TRANSPORTE
const NOMBRES_TRANSPORTE = {
    bus: 'Bus/Guagua',
    moto: 'Moto Taxi',
    carro: 'Carro/Concho'
};

// HORA PICO
const HORAS_PICO = {
    manana: { inicio: 6.5, fin: 10.0 },
    tarde: { inicio: 17.5, fin: 22.0 }
};

// ESTADO GLOBAL
let alertasActivas = { lluvia: false, pico: false };
let rutaActual = null;
let idiomaActual = 'es';
let modoAhorro = false;
let traducciones = {};

// ==========================================
// INICIO - Cargar todo
// ==========================================
document.addEventListener('DOMContentLoaded', async function() {
    console.log("✅ App iniciada - Rutas RD");
    
    // Cargar traducciones
    await cargarTraducciones();
    
    // Inicializar componentes
    llenarSelects();
    dibujarMapa();
    configurarBotones();
    verificarHoraPico();
    generarAlertas();
    
    // Registrar Service Worker (PWA)
    registrarServiceWorker();
    
    // Cargar preferencias guardadas
    cargarPreferencias();
    
    console.log("📍 Lugares:", lugares.length);
    console.log("🌐 Idioma:", idiomaActual);
    console.log("💾 Modo ahorro:", modoAhorro);
});

// ==========================================
// i18n - CARGAR TRADUCCIONES
// ==========================================
async function cargarTraducciones() {
    try {
        const response = await fetch('./data/i18n.json');
        const data = await response.json();
        traducciones = data;
        aplicarTraducciones();
        console.log("✅ Traducciones cargadas");
    } catch (error) {
        console.error("❌ Error cargando traducciones:", error);
    }
}

function aplicarTraducciones() {
    const elementos = document.querySelectorAll('[data-i18n]');
    elementos.forEach(elemento => {
        const clave = elemento.getAttribute('data-i18n');
        if (traducciones[idiomaActual] && traducciones[idiomaActual][clave]) {
            if (elemento.tagName === 'INPUT' || elemento.tagName === 'BUTTON') {
                elemento.textContent = traducciones[idiomaActual][clave];
            } else {
                elemento.textContent = traducciones[idiomaActual][clave];
            }
        }
    });
    
    // Actualizar placeholder de selects
    document.querySelectorAll('select option[data-i18n]').forEach(option => {
        const clave = option.getAttribute('data-i18n');
        if (traducciones[idiomaActual] && traducciones[idiomaActual][clave]) {
            option.textContent = traducciones[idiomaActual][clave];
        }
    });
    
    // Actualizar atributo lang
    document.documentElement.lang = idiomaActual;
}

function cambiarIdioma() {
    idiomaActual = idiomaActual === 'es' ? 'en' : 'es';
    document.getElementById('btn-lang').textContent = idiomaActual === 'es' ? 'EN' : 'ES';
    aplicarTraducciones();
    guardarPreferencias();
    console.log("🌐 Idioma cambiado a:", idiomaActual);
}

// ==========================================
// MODO AHORRO DE DATOS
// ==========================================
function activarModoAhorro() {
    modoAhorro = !modoAhorro;
    document.body.setAttribute('data-saver', modoAhorro);
    document.getElementById('btn-data-saver').style.background = modoAhorro ? 'rgba(22, 163, 74, 0.4)' : '';
    guardarPreferencias();
    console.log("💾 Modo ahorro:", modoAhorro ? 'ACTIVADO' : 'DESACTIVADO');
}

// ==========================================
// PWA - SERVICE WORKER
// ==========================================
function registrarServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then((registration) => {
                    console.log('[PWA] Service Worker registrado:', registration.scope);
                })
                .catch((error) => {
                    console.log('[PWA] Error al registrar Service Worker:', error);
                });
        });
    }
}

// ==========================================
// PREFERENCIAS - LocalStorage
// ==========================================
function guardarPreferencias() {
    const preferencias = {
        idioma: idiomaActual,
        modoAhorro: modoAhorro,
        tema: document.body.getAttribute('data-theme')
    };
    localStorage.setItem('rutasRD_preferencias', JSON.stringify(preferencias));
}

function cargarPreferencias() {
    const guardado = localStorage.getItem('rutasRD_preferencias');
    if (guardado) {
        const preferencias = JSON.parse(guardado);
        
        // Cargar idioma
        if (preferencias.idioma) {
            idiomaActual = preferencias.idioma;
            document.getElementById('btn-lang').textContent = idiomaActual === 'es' ? 'EN' : 'ES';
        }
        
        // Cargar modo ahorro
        if (preferencias.modoAhorro !== undefined) {
            modoAhorro = preferencias.modoAhorro;
            document.body.setAttribute('data-saver', modoAhorro);
            document.getElementById('btn-data-saver').style.background = modoAhorro ? 'rgba(22, 163, 74, 0.4)' : '';
        }
        
        // Cargar tema
        if (preferencias.tema) {
            document.body.setAttribute('data-theme', preferencias.tema);
            document.getElementById('btn-theme').textContent = preferencias.tema === 'dark' ? '☀️' : '🌙';
        }
    }
}

// ==========================================
// VERIFICAR HORA PICO
// ==========================================
function verificarHoraPico() {
    const ahora = new Date();
    const hora = ahora.getHours();
    const minutos = ahora.getMinutes();
    const horaDecimal = hora + (minutos / 60);
    
    const esHoraPicoManana = horaDecimal >= HORAS_PICO.manana.inicio && horaDecimal <= HORAS_PICO.manana.fin;
    const esHoraPicoTarde = horaDecimal >= HORAS_PICO.tarde.inicio && horaDecimal <= HORAS_PICO.tarde.fin;
    
    if (esHoraPicoManana || esHoraPicoTarde) {
        alertasActivas.pico = true;
        const contenedor = document.getElementById('alerts-container');
        const textoPico = traducciones[idiomaActual]?.alertPeak || 'Hora Pico Activa';
        const textoSub = traducciones[idiomaActual]?.alertPeakSub || 'Tarifa +15%';
        
        const alerta = `
            <div class="alert alert--peak">
                <span>🚗</span>
                <div>
                    <div>${textoPico}</div>
                    <small>${textoSub} (${hora}:${(minutos < 10 ? '0' : '') + minutos})</small>
                </div>
            </div>
        `;
        
        if (!contenedor.innerHTML.includes('Hora Pico')) {
            contenedor.innerHTML += alerta;
        }
    } else {
        alertasActivas.pico = false;
    }
}

// ==========================================
// LLENAR SELECTS
// ==========================================
function llenarSelects() {
    const selectOrigen = document.getElementById('origen');
    const selectDestino = document.getElementById('destino');
    
    lugares.forEach(function(lugar) {
        selectOrigen.add(new Option("📍 " + lugar.name, lugar.id));
        selectDestino.add(new Option("🎯 " + lugar.name, lugar.id));
    });
}

// ==========================================
// CONFIGURAR BOTONES
// ==========================================
function configurarBotones() {
    // Formulario
    document.getElementById('search-form').addEventListener('submit', function(e) {
        e.preventDefault();
        verificarHoraPico();
        buscarRutas();
    });
    
    // Botón Tema
    document.getElementById('btn-theme').addEventListener('click', function() {
        const body = document.body;
        const esOscuro = body.getAttribute('data-theme') === 'dark';
        body.setAttribute('data-theme', esOscuro ? 'light' : 'dark');
        this.textContent = esOscuro ? '☀️' : '🌙';
        guardarPreferencias();
    });
    
    // Botón Idioma
    document.getElementById('btn-lang').addEventListener('click', cambiarIdioma);
    
    // Botón Modo Ahorro
    document.getElementById('btn-data-saver').addEventListener('click', activarModoAhorro);
    
    // Botón Información
    document.getElementById('btn-info').addEventListener('click', mostrarPanelInfo);
}

// ==========================================
// MOSTRAR PANEL DE INFORMACIÓN
// ==========================================
function mostrarPanelInfo() {
    const panel = document.getElementById('info-panel');
    const contenido = document.getElementById('info-content');
    
    if (!panel || !contenido) return;
    
    if (rutaActual) {
        const origen = encontrarLugar(rutaActual.origen);
        const destino = encontrarLugar(rutaActual.destino);
        const distancia = calcularDistancia(rutaActual.origen, rutaActual.destino);
        
        const t = traducciones[idiomaActual];
        
        contenido.innerHTML = `
            <div class="info-item">
                <span class="info-label">${t.origin}</span>
                <span class="info-value">${origen?.name || rutaActual.origen}</span>
            </div>
            <div class="info-item">
                <span class="info-label">${t.destination}</span>
                <span class="info-value">${destino?.name || rutaActual.destino}</span>
            </div>
            <div class="info-item">
                <span class="info-label">${t.transport}</span>
                <span class="info-value">${NOMBRES_TRANSPORTE[rutaActual.tipo] || rutaActual.tipo}</span>
            </div>
            <div class="info-item">
                <span class="info-label">${t.distance}</span>
                <span class="info-value">${distancia.toFixed(1)} km</span>
            </div>
            <div class="info-item">
                <span class="info-label">${t.time}</span>
                <span class="info-value">${rutaActual.tiempo} min</span>
            </div>
            <div class="info-item">
                <span class="info-label">${t.cost}</span>
                <span class="info-value">RD$ ${rutaActual.costo}</span>
            </div>
            <div class="info-item">
                <span class="info-label">${t.peakHour}</span>
                <span class="info-value">${alertasActivas.pico ? t.active : t.inactive}</span>
            </div>
            <div class="info-item">
                <span class="info-label">${t.rain}</span>
                <span class="info-value">${alertasActivas.lluvia ? t.active : t.inactive}</span>
            </div>
        `;
    } else {
        const t = traducciones[idiomaActual];
        contenido.innerHTML = `
            <p style="text-align: center; color: var(--text-light);">
                ${t.selectRouteInfo || 'Selecciona una ruta para ver los detalles'}
            </p>
        `;
    }
    
    panel.style.display = 'block';
    panel.scrollIntoView({ behavior: modoAhorro ? 'auto' : 'smooth', block: 'start' });
}

window.cerrarInfo = function() {
    const panel = document.getElementById('info-panel');
    if (panel) {
        panel.style.display = 'none';
    }
};

// ==========================================
// CALCULAR DISTANCIA
// ==========================================
function calcularDistancia(id1, id2) {
    const lugar1 = encontrarLugar(id1);
    const lugar2 = encontrarLugar(id2);
    if (!lugar1 || !lugar2) return 0;
    const dx = lugar2.x - lugar1.x;
    const dy = lugar2.y - lugar1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// ==========================================
// CALCULAR PRECIO
// ==========================================
function calcularPrecio(distancia, tipoTransporte) {
    const precioBase = { moto: 20, bus: 25, carro: 40 };
    let precio = precioBase[tipoTransporte] || 30;
    
    if (distancia < 15) {
        precio = tipoTransporte === 'moto' ? 25 : tipoTransporte === 'bus' ? 30 : 50;
    } else if (distancia < 30) {
        precio = tipoTransporte === 'moto' ? 40 : tipoTransporte === 'bus' ? 35 : 70;
    } else {
        precio = tipoTransporte === 'moto' ? 60 : tipoTransporte === 'bus' ? 40 : 90;
    }
    
    if (alertasActivas.pico) {
        precio = Math.ceil(precio * 1.15);
    }
    
    return Math.round(precio / 5) * 5;
}

// ==========================================
// CALCULAR TIEMPO
// ==========================================
function calcularTiempo(distancia, tipoTransporte) {
    const tiempoBase = { moto: 8, bus: 15, carro: 12 };
    let tiempo = tiempoBase[tipoTransporte] || 15;
    
    if (distancia < 15) tiempo *= 0.8;
    else if (distancia < 30) tiempo *= 1.2;
    else tiempo *= 1.5;
    
    if (alertasActivas.pico) tiempo = Math.ceil(tiempo * 1.25);
    
    return Math.round(tiempo);
}

// ==========================================
// DIBUJAR MAPA SVG
// ==========================================
function dibujarMapa() {
    const svg = document.getElementById('mapa');
    if (!svg) return;
    
    let html = '';
    
    // Flecha
    html += '<defs>';
    html += '<marker id="arrowhead" markerWidth="5" markerHeight="3" refX="4" refY="1.5" orient="auto">';
    html += '<polygon points="0 0, 5 1.5, 0 3" fill="#2563eb" />';
    html += '</marker>';
    html += '</defs>';
    
    // Puntos y nombres
    lugares.forEach(lugar => {
        html += `<circle class="map-node" cx="${lugar.x}" cy="${lugar.y}" r="5" id="node-${lugar.id}" />`;
        html += `<text class="map-label" x="${lugar.labelX}" y="${lugar.labelY}" text-anchor="middle">${lugar.name}</text>`;
    });
    
    // Capa para línea
    html += '<g id="ruta-activa"></g>';
    
    svg.innerHTML = html;
}

function encontrarLugar(id) {
    return lugares.find(l => l.id === id) || null;
}

// ==========================================
// BUSCAR RUTAS
// ==========================================
function buscarRutas() {
    const origen = document.getElementById('origen').value;
    const destino = document.getElementById('destino').value;
    const transporte = document.getElementById('transporte').value;
    
    if (!origen || !destino) {
        alert("⚠️ Selecciona origen y destino");
        return;
    }
    
    if (origen === destino) {
        alert("⚠️ Origen y destino deben ser diferentes");
        return;
    }
    
    limpiarLineaRuta();
    rutaActual = null;
    
    const distancia = calcularDistancia(origen, destino);
    let tiposAmostrar = transporte !== 'todos' ? [transporte] : ['moto', 'bus', 'carro'];
    
    let rutasEncontradas = tiposAmostrar.map(tipo => ({
        type: tipo,
        tiempoReal: calcularTiempo(distancia, tipo),
        costoReal: calcularPrecio(distancia, tipo),
        frequency: tipo === 'moto' ? "5 min" : tipo === 'bus' ? "10 min" : "3 min",
        distancia: distancia
    }));
    
    // Aplicar lluvia
    if (alertasActivas.lluvia) {
        rutasEncontradas.forEach(r => {
            r.tiempoReal = Math.ceil(r.tiempoReal * 1.25);
        });
    }
    
    // Ordenar por precio
    rutasEncontradas.sort((a, b) => a.costoReal - b.costoReal);
    
    mostrarResultados(rutasEncontradas, origen, destino);
    resaltarPuntos(origen, destino);
    
    // Solo dibujar línea si es transporte específico
    if (transporte !== 'todos' && rutasEncontradas.length > 0) {
        dibujarLineaRuta(origen, destino, rutasEncontradas[0].type);
        rutaActual = {
            origen, destino, tipo: rutasEncontradas[0].type,
            tiempo: rutasEncontradas[0].tiempoReal,
            costo: rutasEncontradas[0].costoReal
        };
    }
}

// ==========================================
// MOSTRAR RESULTADOS
// ==========================================
function mostrarResultados(rutas, origen, destino) {
    const contenedor = document.getElementById('routes-container');
    const seccion = document.getElementById('results-section');
    const estadoVacio = document.getElementById('empty-state');
    const contador = document.getElementById('results-count');
    const t = traducciones[idiomaActual];
    
    if (rutas.length === 0) {
        seccion.style.display = 'none';
        if (estadoVacio) {
            estadoVacio.style.display = 'block';
            estadoVacio.innerHTML = `
                <div class="empty-icon">😕</div>
                <h3 class="empty-title">${t.noRoutes}</h3>
                <p class="empty-text">${t.noRoutesText}</p>
            `;
        }
        return;
    }
    
    if (estadoVacio) estadoVacio.style.display = 'none';
    seccion.style.display = 'block';
    contador.textContent = rutas.length;
    
    let html = '';
    
    rutas.forEach((ruta, i) => {
        const esRecomendada = i === 0;
        const icono = ruta.type === 'carro' ? '🚗' : ruta.type === 'moto' ? '🏍️' : '🚌';
        const nombre = NOMBRES_TRANSPORTE[ruta.type];
        const badge = esRecomendada ? `<div class="route-badge">${t.recommended}</div>` : '';
        const claseExtra = esRecomendada ? 'route-card--recommended' : '';
        
        html += `
            <article class="route-card ${claseExtra} fade-in route-card-clickable" 
                     style="animation-delay: ${i * 0.1}s"
                     onclick="seleccionarRutaDelMapa('${ruta.type}', '${origen}', '${destino}', ${ruta.tiempoReal}, ${ruta.costoReal}, this)">
                ${badge}
                <div class="route-header">
                    <div class="route-type route-type--${ruta.type}">${icono} ${nombre}</div>
                </div>
                <div class="route-stats">
                    <div class="stat">
                        <span class="stat-icon">⏱️</span>
                        <div>
                            <div class="stat-label">${t.time}</div>
                            <div class="stat-value">${ruta.tiempoReal} min</div>
                        </div>
                    </div>
                    <div class="stat stat--costo">
                        <span class="stat-icon">💰</span>
                        <div>
                            <div class="stat-label">${t.cost}</div>
                            <div class="stat-value">RD$ ${ruta.costoReal}</div>
                        </div>
                    </div>
                    <div class="stat">
                        <span class="stat-icon">🕐</span>
                        <div>
                            <div class="stat-label">${t.frequency}</div>
                            <div class="stat-value">${ruta.frequency}</div>
                        </div>
                    </div>
                </div>
                <div class="route-actions">
                    <button class="btn-small btn-small--primary" onclick="event.stopPropagation(); seleccionarRuta('${ruta.type}', ${ruta.tiempoReal}, ${ruta.costoReal})">
                        ${t.select}
                    </button>
                    <button class="btn-small" onclick="event.stopPropagation(); guardarFavorito('${ruta.type}', '${origen}', '${destino}', ${ruta.costoReal})">
                        ${t.save}
                    </button>
                </div>
            </article>
        `;
    });
    
    contenedor.innerHTML = html;
}

window.seleccionarRutaDelMapa = function(tipo, origen, destino, tiempo, costo, elemento) {
    document.querySelectorAll('.route-card').forEach(card => card.classList.remove('route-card--selected'));
    if (elemento) elemento.classList.add('route-card--selected');
    
    dibujarLineaRuta(origen, destino, tipo);
    resaltarPuntos(origen, destino);
    
    rutaActual = { origen, destino, tipo, tiempo, costo };
    mostrarPanelInfo();
};

function resaltarPuntos(idOrigen, idDestino) {
    document.querySelectorAll('.map-node').forEach(punto => {
        punto.classList.remove('map-node--active');
        punto.setAttribute('r', '5');
    });
    
    ['node-' + idOrigen, 'node-' + idDestino].forEach(id => {
        const punto = document.getElementById(id);
        if (punto) {
            punto.classList.add('map-node--active');
            punto.setAttribute('r', '7');
        }
    });
}

function dibujarLineaRuta(idOrigen, idDestino, tipoTransporte) {
    const origen = encontrarLugar(idOrigen);
    const destino = encontrarLugar(idDestino);
    const capaRuta = document.getElementById('ruta-activa');
    
    if (!origen || !destino || !capaRuta) return;
    
    const color = COLORES_TRANSPORTE[tipoTransporte] || '#2563eb';
    const linea = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    
    linea.setAttribute('class', 'map-route-line');
    linea.setAttribute('x1', origen.x);
    linea.setAttribute('y1', origen.y);
    linea.setAttribute('x2', destino.x);
    linea.setAttribute('y2', destino.y);
    linea.setAttribute('stroke', color);
    linea.setAttribute('marker-end', 'url(#arrowhead)');
    
    capaRuta.innerHTML = '';
    capaRuta.appendChild(linea);
}

function limpiarLineaRuta() {
    const capaRuta = document.getElementById('ruta-activa');
    if (capaRuta) capaRuta.innerHTML = '';
}

function generarAlertas() {
    const contenedor = document.getElementById('alerts-container');
    if (!contenedor) return;
    
    if (Math.random() > 0.7) {
        alertasActivas.lluvia = true;
        const t = traducciones[idiomaActual];
        contenedor.innerHTML += `
            <div class="alert alert--rain">
                <span>🌧️</span>
                <div>
                    <div>${t.alertRain}</div>
                    <small>${t.alertRainSub}</small>
                </div>
            </div>
        `;
    }
}

window.seleccionarRuta = function(tipo, tiempo, costo) {
    const t = traducciones[idiomaActual];
    alert(`✅ ${t.select}\n\n${NOMBRES_TRANSPORTE[tipo]}\n${t.time}: ${tiempo} min\n${t.cost}: RD$ ${costo}\n\n¡Buen viaje! 🎉`);
};

window.guardarFavorito = function(tipo, origen, destino, costo) {
    const t = traducciones[idiomaActual];
    alert(`❤️ ${t.save}\n\n${tipo.toUpperCase()}\n${origen} → ${destino}\n${t.cost}: RD$ ${costo}`);
};