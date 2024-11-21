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
    marker.bindPopup(`
        <strong>${gasolinera.Dirección}</strong><br>
        Municipio: ${gasolinera.Municipio}<br>
        Gasolina 95: ${gasolinera['Precio Gasolina 95 E5']} €<br>
        Diésel: ${gasolinera['Precio Gasoleo A']} €<br>
        <small>Horario: ${gasolinera.Horario}</small>
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
                lon: parseFloat(gasolinera['Longitud (WGS84)'].replace(',', '.'))
            }))
            .filter(g => g.Provincia === "ALICANTE");

        // Ordenar por distancia
        gasolineras.sort((a, b) => {
            const distA = getDistance(lat, lon, a.lat, a.lon);
            const distB = getDistance(lat, lon, b.lat, b.lon);
            return distA - distB;
        });

        // Tomar las 6 más cercanas
        const topGasolineras = gasolineras.slice(0, 6);

        mostrarGasolineras(topGasolineras, lat, lon);
    } catch (error) {
        console.error("Error al obtener las gasolineras:", error);
        document.getElementById("gasolineras-list").innerHTML =
            "<li>Error al cargar los datos. Inténtalo más tarde.</li>";
    }
}

// Calcula la distancia entre dos coordenadas (Haversine)
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
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

    gasolineras.forEach(gasolinera => {
        // Añadir marcador al mapa
        addMarker(gasolinera, gasolinera.lat, gasolinera.lon);

        // Crear elemento en la lista
        const item = document.createElement("li");
        item.innerHTML = `
            <strong>${gasolinera.Dirección}</strong><br>
            Municipio: ${gasolinera.Municipio}<br>
            Gasolina 95: ${gasolinera['Precio Gasolina 95 E5']} €<br>
            Diésel: ${gasolinera['Precio Gasoleo A']} €<br>
        `;
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