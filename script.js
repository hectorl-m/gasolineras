const url = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/";

async function fetchGasolineras() {
    try {
        const response = await fetch(url);
        const data = await response.json();

        const gasolineras = data.ListaEESSPrecio.filter(
            g => g.Provincia === "ALICANTE"
        );

        // Ordenar por el precio de la Gasolina 95 (convertir "," a ".")
        const gasolinerasOrdenadas = gasolineras.sort((a, b) => {
            return parseFloat(a['Precio Gasolina 95 E5'].replace(',', '.')) - 
                   parseFloat(b['Precio Gasolina 95 E5'].replace(',', '.'));
        });

        // Seleccionar las 6 primeras
        const topGasolineras = gasolinerasOrdenadas.slice(0, 6);

        mostrarGasolineras(topGasolineras);
    } catch (error) {
        console.error("Error al obtener las gasolineras:", error);
        document.getElementById("gasolinera-container").innerHTML =
            "<p>Error al cargar los datos. Inténtalo más tarde.</p>";
    }
}

function mostrarGasolineras(gasolineras) {
    const contenedor = document.getElementById("gasolinera-container");
    contenedor.innerHTML = "";

    gasolineras.forEach(gasolinera => {
        const elemento = document.createElement("div");
        elemento.classList.add("gasolinera");

        elemento.innerHTML = `
            <h2>${gasolinera.Dirección}</h2>
            <p><strong>Municipio:</strong> ${gasolinera.Municipio}</p>
            <p><strong>Precio Gasolina 95:</strong> ${gasolinera['Precio Gasolina 95 E5']} €</p>
            <p><strong>Precio Gasóleo A:</strong> ${gasolinera['Precio Gasoleo A']} €</p>
            <p><strong>Precio Gasolina 98:</strong> ${gasolinera['Precio Gasolina 98 E5']} €</p>
            <p><strong>Horario:</strong> ${gasolinera.Horario}</p>
        `;

        contenedor.appendChild(elemento);
    });
}

// Llamada inicial a la función
fetchGasolineras();
