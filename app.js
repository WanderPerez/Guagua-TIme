// ==========================================
// 🎓 RUTAS RD - VERSIÓN CORREGIDA PARA GITHUB
// ==========================================

// LUGARES
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

// ==========================================
// TRADUCCIONES POR DEFECTO (SI FALLA EL JSON)
// ==========================================
const traduccionesPorDefecto = {
    es: {
        appTitle: "🇩🇴 Rutas RD",
        searchTitle: "🔍 Buscar Ruta",
        origin: "📍 Origen",
        destination: "🎯 Destino",
        transport: "🚌 Transporte",
        all: "Todos",
        bus: "🚌 Bus",
        car: "🚗 Carro",
        moto: "🏍️ Moto",
        search: "🔎 Buscar",
        map: "🗺️ Mapa",
        mapHint: "💡 Selecciona un transporte específico",
        routesFound: "📋 Rutas Encontradas",
        noRoutes: "No hay rutas",
        noRoutesText: "Intenta con otra combinación",
        selectOrigin: "Selecciona...",
        recommended: "⭐ Más Económica",
        time: "Tiempo",
        cost: "Costo",
        frequency: "Frecuencia",
        select: "✅ Seleccionar",
        save: "❤️ Guardar",
        routeInfo: "📊 Información",
        selectRouteInfo: "Selecciona una ruta",
        footer: "© 2024 Rutas RD 🇩🇴",
        distance: "📏 Distancia",
        peakHour: "🚗 Hora Pico",
        rain: "🌧️ Lluvia",
        active: "✅ Activa",
        inactive: "❌ No activa",
        alertPeak: "Hora Pico",
        alertRain: "Lluvia",
        alertPeakSub: "+15%",
        alertRainSub: "+25%"
    },
    en: {
        appTitle: "🇩🇴 Routes RD",
        searchTitle: "🔍 Search Route",
        origin: "📍 Origin",
        destination: "🎯 Destination",
        transport: "🚌 Transport",
        all: "All",
        bus: "🚌 Bus",
        car: "🚗 Car",
        moto: "🏍️ Moto",
        search: "🔎 Search",
        map: "🗺️ Map",
        mapHint: "💡 Select a specific transport",
        routesFound: "📋 Routes Found",
        noRoutes: "No routes",
        noRoutesText: "Try another combination",
        selectOrigin: "Select...",
        recommended: "⭐ Most Economical",
        time: "Time",
        cost: "Cost",
        frequency: "Frequency",
        select: "✅ Select",
        save: "❤️ Save",
        routeInfo: "📊 Information",
        selectRouteInfo: "Select a route",
        footer: "© 2024 Routes RD 🇩🇴",
        distance: "📏 Distance",
        peakHour: "🚗 Peak Hour",
        rain: "🌧️ Rain",
        active: "✅ Active",
        inactive: "❌ Inactive",
        alertPeak: "Peak Hour",
        alertRain: "Rain",
        alertPeakSub: "+15%",
        alertRainSub: "+25%"
    }
};

// Usar traducciones por defecto inicialmente
let traducciones = JSON.parse(JSON.stringify(traduccionesPorDefecto));

// ==========================================
// INICIO
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ App iniciada - Rutas RD");
    
    // Cargar traducciones (no bloqueante)
    cargarTraducciones();
    
    // Inicializar componentes
    llenarSelects();
    dibujarMapa();
    configurarBotones();
    verificarHoraPico();
    generarAlertas();
    
    console.log("📍 Lugares:", lugares.length);
    console.log("🌐 Idioma:", idiomaActual);
});

// ==========================================
// CARGAR TRADUCCIONES - VERSIÓN CORREGIDA
// ==========================================
async function cargarTraducciones() {
    try {
        // Probar diferentes rutas para GitHub Pages
        const rutasPosibles = [
            'data/i18n.json',
            './data/i18n.json',
            '/rutas-rd/data/i18n.json'
        ];
        
        let datosCargados = false;
        
        for (const ruta of rutasPosibles) {
            try {
                const response = await fetch(ruta);
                if (response.ok) {
                    const datos = await response.json();
                    // Fusionar con traducciones por defecto
                    traducciones = { ...traduccionesPorDefecto, ...datos };
                    aplicarTraducciones();
                    console.log("✅ Traducciones cargadas desde:", ruta);
                    datosCargados = true;
                    break;
                }
            } catch (e) {
                console.log("⚠️ Intento fallido:", ruta);
            }
        }
        
        if (!datosCargados) {
            console.warn("⚠️ Usando traducciones por defecto");
            aplicarTraducciones();
        }
    } catch (error) {
        console.warn("⚠️ Error cargando traducciones:", error.message);
        console.warn("🌐 Usando traducciones por defecto");
        aplicarTraducciones();
    }
}

function aplicarTraducciones() {
    const t = traducciones[idiomaActual] || traducciones['es'];
    
    document.querySelectorAll('[data-i18n]').forEach(elemento => {
        const clave = elemento.getAttribute('data-i18n');
        if (t[clave]) {
            elemento.textContent = t[clave];
        }
    });
    
    document.documentElement.lang = idiomaActual;
}

function cambiarIdioma() {
    idiomaActual = idiomaActual === 'es' ? 'en' : 'es';
    document.getElementById('btn-lang').textContent = idiomaActual === 'es' ? 'EN' : 'ES';
    aplicarTraducciones();
}

// ==========================================
// MODO AHORRO
// ==========================================
function activarModoAhorro() {
    modoAhorro = !modoAhorro;
    document.body.setAttribute('data-saver', modoAhorro);
    document.getElementById('btn-data-saver').style.background = modoAhorro ? 'rgba(22, 163, 74, 0.4)' : '';
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
        const t = traducciones[idiomaActual] || traducciones['es'];
        
        const alerta = `
            <div class="alert alert--peak">
                <span>🚗</span>
                <div>
                    <div>${t.alertPeak}</div>
                    <small>${t.alertPeakSub} (${hora}:${(minutos < 10 ? '0' : '') + minutos})</small>
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
    document.getElementById('search-form').addEventListener('submit', function(e) {
        e.preventDefault();
        verificarHoraPico();
        buscarRutas();
    });
    
    document.getElementById('btn-theme').addEventListener('click', function() {
        const body = document.body;
        const esOscuro = body.getAttribute('data-theme') === 'dark';
        body.setAttribute('data-theme', esOscuro ? 'light' : 'dark');
        this.textContent = esOscuro ? '☀️' : '🌙';
    });
    
    document.getElementById('btn-lang').addEventListener('click', cambiarIdioma);
    document.getElementById('btn-data-saver').addEventListener('click', activarModoAhorro);
    document.getElementById('btn-info').addEventListener('click', mostrarPanelInfo);
}

// ==========================================
// MOSTRAR PANEL DE INFORMACIÓN
// ==========================================
function mostrarPanelInfo() {
    const panel = document.getElementById('info-panel');
    const contenido = document.getElementById('info-content');
    
    if (!panel || !contenido) return;
    
    const t = traducciones[idiomaActual] || traducciones['es'];
    
    if (rutaActual) {
        const origen = encontrarLugar(rutaActual.origen);
        const destino = encontrarLugar(rutaActual.destino);
        const distancia = calcularDistancia(rutaActual.origen, rutaActual.destino);
        
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
        `;
    } else {
        contenido.innerHTML = `<p style="text-align: center; color: var(--text-light);">${t.selectRouteInfo}</p>`;
    }
    
    panel.style.display = 'block';
}

window.cerrarInfo = function() {
    const panel = document.getElementById('info-panel');
    if (panel) panel.style.display = 'none';
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
// DIBUJAR MAPA
// ==========================================
function dibujarMapa() {
    const svg = document.getElementById('mapa');
    if (!svg) return;
    
    let html = '';
    
    html += '<defs>';
    html += '<marker id="arrowhead" markerWidth="5" markerHeight="3" refX="4" refY="1.5" orient="auto">';
    html += '<polygon points="0 0, 5 1.5, 0 3" fill="#2563eb" />';
    html += '</marker>';
    html += '</defs>';
    
    lugares.forEach(lugar => {
        html += `<circle class="map-node" cx="${lugar.x}" cy="${lugar.y}" r="5" id="node-${lugar.id}" />`;
        html += `<text class="map-label" x="${lugar.labelX}" y="${lugar.labelY}" text-anchor="middle">${lugar.name}</text>`;
    });
    
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
    
    if (alertasActivas.lluvia) {
        rutasEncontradas.forEach(r => {
            r.tiempoReal = Math.ceil(r.tiempoReal * 1.25);
        });
    }
    
    rutasEncontradas.sort((a, b) => a.costoReal - b.costoReal);
    
    mostrarResultados(rutasEncontradas, origen, destino);
    resaltarPuntos(origen, destino);
    
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
// MOSTRAR RESULTADOS - CORREGIDO
// ==========================================
function mostrarResultados(rutas, origen, destino) {
    const contenedor = document.getElementById('routes-container');
    const seccion = document.getElementById('results-section');
    const estadoVacio = document.getElementById('empty-state');
    const contador = document.getElementById('results-count');
    
    // Obtener traducciones seguras
    const t = traducciones[idiomaActual] || traducciones['es'];
    
    if (rutas.length === 0) {
        seccion.style.display = 'none';
        if (estadoVacio) {
            estadoVacio.style.display = 'block';
            estadoVacio.innerHTML = `
                <div class="empty-icon">😕</div>
                <h3 class="empty-title">${t.noRoutes || 'No hay rutas'}</h3>
                <p class="empty-text">${t.noRoutesText || 'Intenta con otra combinación'}</p>
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
        const badge = esRecomendada ? `<div class="route-badge">${t.recommended || '⭐ Recomendada'}</div>` : '';
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
                            <div class="stat-label">${t.time || 'Tiempo'}</div>
                            <div class="stat-value">${ruta.tiempoReal} min</div>
                        </div>
                    </div>
                    <div class="stat stat--costo">
                        <span class="stat-icon">💰</span>
                        <div>
                            <div class="stat-label">${t.cost || 'Costo'}</div>
                            <div class="stat-value">RD$ ${ruta.costoReal}</div>
                        </div>
                    </div>
                    <div class="stat">
                        <span class="stat-icon">🕐</span>
                        <div>
                            <div class="stat-label">${t.frequency || 'Frecuencia'}</div>
                            <div class="stat-value">${ruta.frequency}</div>
                        </div>
                    </div>
                </div>
                <div class="route-actions">
                    <button class="btn-small btn-small--primary" onclick="event.stopPropagation(); seleccionarRuta('${ruta.type}', ${ruta.tiempoReal}, ${ruta.costoReal})">
                        ${t.select || '✅ Seleccionar'}
                    </button>
                    <button class="btn-small" onclick="event.stopPropagation(); guardarFavorito('${ruta.type}', '${origen}', '${destino}', ${ruta.costoReal})">
                        ${t.save || '❤️ Guardar'}
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
        const t = traducciones[idiomaActual] || traducciones['es'];
        contenedor.innerHTML += `
            <div class="alert alert--rain">
                <span>🌧️</span>
                <div>
                    <div>${t.alertRain || 'Lluvia'}</div>
                    <small>${t.alertRainSub || '+25%'}</small>
                </div>
            </div>
        `;
    }
}

window.seleccionarRuta = function(tipo, tiempo, costo) {
    const t = traducciones[idiomaActual] || traducciones['es'];
    alert(`✅ ${t.select || 'Seleccionar'}\n\n${NOMBRES_TRANSPORTE[tipo]}\n${t.time || 'Tiempo'}: ${tiempo} min\n${t.cost || 'Costo'}: RD$ ${costo}\n\n¡Buen viaje! 🎉`);
};

window.guardarFavorito = function(tipo, origen, destino, costo) {
    alert(`❤️ Guardado\n\n${tipo.toUpperCase()}\n${origen} → ${destino}\nRD$ ${costo}`);
};