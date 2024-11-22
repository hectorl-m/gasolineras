const apiUrl = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/";
const maxDistanceKm = 10; // Máxima distancia en kilómetros para filtrar las gasolineras
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
                precio95: parseFloat(gasolinera['Precio Gasolina 95 E5'].replace(',', '.')) || Infinity,
                distancia: getDistance(lat, lon, parseFloat(gasolinera.Latitud.replace(',', '.')), parseFloat(gasolinera['Longitud (WGS84)'].replace(',', '.')))
            }))
            .filter(g => g.Provincia === "ALICANTE" && g.distancia <= maxDistanceKm);

        // Ordenar por el precio de la Gasolina 95
        gasolineras.sort((a, b) => a.precio95 - b.precio95);

        mostrarGasolineras(gasolineras, lat, lon);
    } catch (error) {
        console.error("Error al obtener las gasolineras:", error);
        document.getElementById("gasolineras-list").innerHTML =
            "<li>Error al cargar los datos. Inténtalo más tarde.</li>";
    }
}

// Calcula la distancia entre dos coordenadas (Haversine)
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Muestra las gasolineras en el mapa y la lista
function mostrarGasolineras(gasolineras, lat, lon) {
    const list = document.getElementById("gasolineras-list");
    list.innerHTML = "";

    // Verifica si hay gasolineras en el rango
    if (gasolineras.length === 0) {
        list.innerHTML = "<li>No se encontraron gasolineras cercanas en el rango establecido.</li>";
        return;
    }

    // Seleccionar las 6 más baratas
    const gasolinerasTop = gasolineras.slice(0, 6);

    gasolinerasTop.forEach(gasolinera => {
        // Precio del diésel: comprueba si está definido
        const precioDiesel = gasolinera['Precio Gasóleo A'] 
            ? `${gasolinera['Precio Gasóleo A']} €` 
            : "No disponible";

        // Añadir marcador al mapa
        addMarker(gasolinera, gasolinera.lat, gasolinera.lon);

        // Crear elemento en la lista con enlace a Google Maps
        const item = document.createElement("li");
        const googleMapsLink = `https://www.google.com/maps/dir/?api=1&destination=${gasolinera.lat},${gasolinera.lon}`;
        item.innerHTML = `
            <strong>${gasolinera.Rótulo}</strong>
            <p>Dirección: ${gasolinera.Dirección}</p>
            <p>Gasolina 95: ${gasolinera['Precio Gasolina 95 E5']} €</p>
            <p>Diésel: ${precioDiesel}</p>
            <p>Distancia: ${gasolinera.distancia.toFixed(2)} km</p>
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
