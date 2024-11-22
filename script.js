const apiUrl = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/";
let map;

// Inicializa el mapa
function initMap(lat, lon) {
    map = L.map('map').setView([lat, lon], 13);

    // Capa de mapa base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
}

// Añade un marcador al mapa
function addMarker(gasolinera, lat, lon) {
    const marker = L.marker([lat, lon]).addTo(map);

    // Popup con enlace a Google Maps
    const googleMapsLink = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
    marker.bindPopup(`
        <strong>${gasolinera.Rótulo}</strong><br>
        Dirección: ${gasolinera.Dirección}<br>
        Precio Gasolina 95: ${gasolinera['Precio Gasolina 95 E5']} €<br>
        <a href="${googleMapsLink}" target="_blank">Ir en Google Maps</a>
    `);
}

// Obtiene gasolineras cercanas
async function fetchGasolineras(lat, lon) {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const gasolineras = data.ListaEESSPrecio
            .map(gasolinera => ({
                ...gasolinera,
                lat: parseFloat(gasolinera.Latitud.replace(',', '.')),
                lon: parseFloat(gasolinera['Longitud (WGS84)'].replace(',', '.')),
                precio95: parseFloat(gasolinera['Precio Gasolina 95 E5'].replace(',', '.')) || Infinity
            }))
            .filter(g => g.Provincia === "ALICANTE");

        // Ordenar por el precio de la Gasolina 95
        gasolineras.sort((a, b) => a.precio95 - b.precio95);

        mostrarGasolineras(gasolineras, lat, lon);
    } catch (error) {
        console.error("Error al obtener las gasolineras:", error);
        document.getElementById("gasolineras-list").innerHTML =
            "<li>Error al cargar los datos. Inténtalo más tarde.</li>";
    }
}

// Muestra las gasolineras en el mapa y la lista
function mostrarGasolineras(gasolineras, lat, lon) {
    const list = document.getElementById("gasolineras-list");
    list.innerHTML = "";

    gasolineras.slice(0, 6).forEach(gasolinera => {
        // Añadir marcador al mapa
        addMarker(gasolinera, gasolinera.lat, gasolinera.lon);

        // Crear elemento en la lista con enlace a Google Maps
        const item = document.createElement("li");
        const googleMapsLink = `https://www.google.com/maps/dir/?api=1&destination=${gasolinera.lat},${gasolinera.lon}`;
        item.innerHTML = `
            <strong>${gasolinera.Rótulo}</strong><br>
            Dirección: ${gasolinera.Dirección}<br>
            Gasolina 95: ${gasolinera['Precio Gasolina 95 E5']} €<br>
            <a href="${googleMapsLink}" target="_blank">Ir en Google Maps</a>
        `;
        item.onclick = () => window.open(googleMapsLink, "_blank");
        list.appendChild(item);
    });
}

// Obtener ubicación del usuario
navigator.geolocation.getCurrentPosition(
    position => {
        const { latitude, longitude } = position.coords;
        initMap(latitude, longitude);
        fetchGasolineras(latitude, longitude);
    },
    () => {
        alert("No se pudo obtener la ubicación.");
    }
);
