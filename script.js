document.addEventListener("DOMContentLoaded", () => {
    const map = L.map("map").setView([40.416775, -3.703790], 6); // Coordenadas iniciales en el centro de España

    // Inicializar el mapa
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
    }).addTo(map);

    const apiURL = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/";

    // Detectar ubicación del usuario
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                map.setView([latitude, longitude], 12); // Centrar el mapa en la ubicación del usuario
                obtenerGasolineras(latitude, longitude);
            },
            () => {
                alert("No se pudo acceder a la ubicación. Mostrando resultados generales.");
                obtenerGasolineras(); // Cargar sin ubicación específica
            }
        );
    } else {
        alert("La geolocalización no está disponible en tu navegador.");
        obtenerGasolineras(); // Cargar sin ubicación específica
    }

    function obtenerGasolineras(userLat = 40.416775, userLng = -3.703790) {
        fetch(apiURL)
            .then(response => response.json())
            .then(data => {
                const gasolineras = data.ListaEESSPrecio;

                // Calcular la distancia a cada gasolinera y ordenar por precio de Gasolina 95
                const gasolinerasCercanas = gasolineras
                    .map(gasolinera => {
                        const lat = parseFloat(gasolinera["Latitud"].replace(",", "."));
                        const lng = parseFloat(gasolinera["Longitud (WGS84)"].replace(",", "."));
                        const distancia = calcularDistancia(userLat, userLng, lat, lng);

                        return {
                            nombre: gasolinera["Rótulo"],
                            direccion: gasolinera["Dirección"],
                            localidad: gasolinera["Municipio"],
                            gasolina95: parseFloat(gasolinera["Precio Gasolina 95 E5"].replace(",", ".")),
                            diesel: parseFloat(gasolinera["Precio Gasoleo A"].replace(",", ".")),
                            lat,
                            lng,
                            distancia,
                        };
                    })
                    .filter(g => !isNaN(g.gasolina95) && !isNaN(g.diesel)) // Filtrar datos válidos
                    .sort((a, b) => a.gasolina95 - b.gasolina95) // Ordenar por precio
                    .slice(0, 6); // Seleccionar las 6 más baratas

                mostrarGasolineras(gasolinerasCercanas);
                mostrarEnMapa(gasolinerasCercanas);
            })
            .catch(error => console.error("Error al obtener datos de gasolineras:", error));
    }

    function calcularDistancia(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radio de la Tierra en km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distancia en km
    }

    function mostrarGasolineras(gasolineras) {
        const lista = document.getElementById("gasolineras-list");
        lista.innerHTML = ""; // Limpiar lista

        gasolineras.forEach(gasolinera => {
            const item = document.createElement("li");
            item.innerHTML = `
                <strong>${gasolinera.nombre}</strong>
                <p>${gasolinera.direccion}, ${gasolinera.localidad}</p>
                <p>Gasolina 95: ${gasolinera.gasolina95.toFixed(2)} €/L</p>
                <p>Diésel: ${gasolinera.diesel.toFixed(2)} €/L</p>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${gasolinera.lat},${gasolinera.lng}" target="_blank">
                    Cómo llegar
                </a>
            `;
            lista.appendChild(item);
        });
    }

    function mostrarEnMapa(gasolineras) {
        gasolineras.forEach(gasolinera => {
            const marker = L.marker([gasolinera.lat, gasolinera.lng]).addTo(map);
            marker.bindPopup(`
                <strong>${gasolinera.nombre}</strong><br>
                ${gasolinera.direccion}<br>
                Gasolina 95: ${gasolinera.gasolina95.toFixed(2)} €/L<br>
                Diésel: ${gasolinera.diesel.toFixed(2)} €/L<br>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${gasolinera.lat},${gasolinera.lng}" target="_blank">Cómo llegar</a>
            `);
        });
    }
});
